package main

import (
	"fmt"
	"net/http"
	"time"

	"os"

	"github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/logger"
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
	// init and ping datastore
	dbName := os.Getenv("PARROT_DB_NAME")
	dbURL := os.Getenv("PARROT_DB_URL")
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

	// init routers and middleware
	// CORS, Rate-limiting, etc... is handled by the server (e.g. nginx)
	// Here we only care about application level middleware
	router := chi.NewRouter()
	router.Use(
		middleware.RequestID,
		middleware.RealIP,
		logger.Request,
		middleware.StripSlashes,
	)

	signingKey := os.Getenv("PARROT_AUTH_SIGNING_KEY")
	if signingKey == "" {
		logrus.Fatal("no auth signing key set in env")
	}

	ap := auth.Provider{Name: "LOCAL_DEV", SigningKey: []byte(signingKey)}

	router.Post("/auth/authenticate", authenticate(ap, ds))
	router.Post("/auth/introspect", instrospectToken(ap, ds))

	// config server
	addr := os.Getenv("PARROT_AUTH_SERVER_PORT")
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
