package main

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/parrot-api/api"
	"github.com/anthonynsimon/parrot/parrot-api/auth"
	"github.com/anthonynsimon/parrot/parrot-api/datastore"
	"github.com/anthonynsimon/parrot/parrot-api/logger"
	"github.com/joho/godotenv"
	"github.com/pressly/chi"
	"github.com/pressly/chi/middleware"
)

func init() {
	// Config log
	logrus.SetOutput(os.Stdout)
	logrus.SetFormatter(&logrus.TextFormatter{})
	logrus.SetLevel(logrus.InfoLevel)
}

// TODO: refactor this into cli to start server
func main() {
	// init environment variables
	err := godotenv.Load()
	if err != nil {
		logrus.Info(err)
	}

	// init and ping datastore
	dbName := os.Getenv("PARROT_API_DB")
	dbURL := os.Getenv("PARROT_API_DB_URL")
	if dbName == "" || dbURL == "" {
		logrus.Fatal("no db set in env")
	}

	ds, err := datastore.NewDatastore(dbName, dbURL)
	if err != nil {
		logrus.Fatal(err)
	}
	defer ds.Close()

	// Ping DB until service is up, block meanwhile
	blockAndRetry(5*time.Second, func() bool {
		if err = ds.Ping(); err != nil {
			logrus.Error(fmt.Sprintf("failed to ping datastore.\nerr: %s", err))
			return false
		}
		return true
	})

	migrationStrategy := os.Getenv("PARROT_DB_MIGRATION_STRATEGY")
	if migrationStrategy != "" {
		logrus.Infof("migration strategy is set to '%s'", migrationStrategy)

		dirPath := os.Getenv("PARROT_DB_MIGRATIONS_DIR")
		if dirPath == "" {
			dirPath = fmt.Sprintf("./datastore/%s/migrations", dbName)
			logrus.Infof("migrations directory not set, using default one: '%s'", dirPath)
		}

		var fn func(string) error

		switch migrationStrategy {
		// Case when we want to start clean each time
		case "down,up":
			fn = func(path string) error {
				err := ds.MigrateDown(path)
				if err != nil {
					return err
				}
				err = ds.MigrateUp(path)
				if err != nil {
					return err
				}
				return nil
			}
		// Case when we want to apply migrations if needed
		case "up":
			fn = ds.MigrateUp
		// Case when we want to simply drop everything
		case "down":
			fn = ds.MigrateDown
		default:
			logrus.Fatalf("could not recognize migration strategy '%s'", migrationStrategy)
		}

		logrus.Info("migrating...")
		err := fn(dirPath)
		if err != nil {
			logrus.Fatal(err)
		}
		logrus.Info("migration completed successfully")
	}

	router := chi.NewRouter()
	router.Use(
		func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Add("Strict-Transport-Security", "max-age=63072000; includeSubDomains")
				next.ServeHTTP(w, r)
			})
		},
		middleware.Recoverer,
		middleware.RequestID,
		middleware.RealIP,
		logger.Request,
		middleware.StripSlashes,
	)

	signingKey := os.Getenv("PARROT_AUTH_SIGNING_KEY")
	if signingKey == "" {
		logrus.Fatal("no auth signing key set")
	}
	issuerName := os.Getenv("PARROT_AUTH_ISSUER_NAME")
	if signingKey == "" {
		logrus.Warn("no auth issuer name set, resorting to default")
		issuerName = "parrot-default"
	}

	tp := auth.TokenProvider{Name: issuerName, SigningKey: []byte(signingKey)}
	router.Mount("/api/v1/auth", auth.NewRouter(ds, tp))
	router.Mount("/api/v1", api.NewRouter(ds, tp))

	// config and init server
	addr := ":443"

	cfg := &tls.Config{
		MinVersion:               tls.VersionTLS12,
		CurvePreferences:         []tls.CurveID{tls.CurveP521, tls.CurveP384, tls.CurveP256},
		PreferServerCipherSuites: true,
		CipherSuites: []uint16{
			tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
			tls.TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,
			tls.TLS_RSA_WITH_AES_256_GCM_SHA384,
			tls.TLS_RSA_WITH_AES_256_CBC_SHA,
		},
	}

	s := &http.Server{
		Addr:           addr,
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
		TLSConfig:      cfg,
		TLSNextProto:   make(map[string]func(*http.Server, *tls.Conn, http.Handler), 0),
	}

	logrus.Info(fmt.Sprintf("server listening on %s", addr))

	logrus.Fatal(s.ListenAndServeTLS("certs/cert.pem", "certs/key.pem"))
}

func blockAndRetry(d time.Duration, fn func() bool) {
	for !fn() {
		logrus.Infof("retrying in %s...\n", d.String())
		time.Sleep(d)
	}
}
