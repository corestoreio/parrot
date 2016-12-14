package main

import (
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

func main() {
	// init environment variables
	err := godotenv.Load()
	if err != nil {
		logrus.Info(err)
	}

	// init and ping datastore
	dbName := os.Getenv("PARROT_API_DB_NAME")
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

	router := chi.NewRouter()
	router.Use(
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
	router.Mount("/api/auth", auth.NewRouter(ds, tp))
	router.Mount("/api", api.NewRouter(ds, tp))

	// config server
	addr := os.Getenv("PARROT_API_SERVER_PORT")
	if addr == "" {
		addr = ":8080"
	}

	// init server
	s := &http.Server{
		Addr:           addr,
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	logrus.Info(fmt.Sprintf("Listening on %s", addr))

	logrus.Fatal(s.ListenAndServe())
}

func blockAndRetry(d time.Duration, fn func() bool) {
	for !fn() {
		fmt.Printf("retrying in %s...\n", d.String())
		time.Sleep(d)
	}
}
