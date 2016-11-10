package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/api"
	"github.com/anthonynsimon/parrot/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/logger"
	"github.com/joho/godotenv"
	"github.com/pressly/chi"
	"github.com/pressly/chi/middleware"
)

func init() {
	// Config log
	logrus.SetOutput(os.Stdout)
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.SetLevel(logrus.InfoLevel)
}

func main() {
	// init environment variables
	err := godotenv.Load()
	if err != nil {
		logrus.Fatal(err)
	}

	// init and ping datastore
	dbName := os.Getenv("DB")
	dbURL := os.Getenv("DB_URL")

	ds, err := datastore.NewDatastore(dbName, dbURL)
	if err != nil {
		logrus.Fatal(err)
	}

	defer ds.Close()
	if err = ds.Ping(); err != nil {
		logrus.Fatal(fmt.Sprintf("failed to ping datastore.\nerr: %s", err))
	}

	// init routers and middleware
	mainRouter := chi.NewRouter()
	mainRouter.Use(
		logger.Request,
		middleware.StripSlashes,
	)

	ap := auth.Provider{
		Name:       string([]byte(os.Getenv("DOMAIN"))),
		SigningKey: []byte(os.Getenv("API_SIGNING_KEY"))}

	apiRouter := api.NewRouter(ds, ap)
	mainRouter.Mount("/api", apiRouter)

	// config server
	addr := "localhost:8080"

	// init server
	s := &http.Server{
		Addr:           addr,
		Handler:        mainRouter,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	logrus.Info(fmt.Sprintf("Listening on %s", addr))

	logrus.Fatal(s.ListenAndServe())
}
