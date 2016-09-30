package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	log "github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/api"
	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/logger"
	"github.com/joho/godotenv"
)

func init() {
	// Config log
	log.SetFormatter(&log.TextFormatter{})
}

func main() {
	// init environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	// init and ping datastore
	ds, err := initDatastore()
	if err != nil {
		log.Fatal(err)
	}
	defer ds.Close()
	if err = ds.Ping(); err != nil {
		log.Fatal(err)
	}

	// config auth
	auth.SigningKey = []byte(os.Getenv("API_SIGNING_KEY"))

	// init api
	apiRouter := api.Handler(ds)
	withLogger := logger.Request(apiRouter)

	// config server
	addr := "localhost:8080"

	// init server
	s := &http.Server{
		Addr:           addr,
		Handler:        withLogger,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	fmt.Println(fmt.Sprintf("Listening on %s", addr))

	log.Fatal(s.ListenAndServe())
}

func initDatastore() (*datastore.Datastore, error) {
	name := os.Getenv("DB")
	url := os.Getenv("DB_URL")

	ds, err := datastore.NewDatastore(name, url)
	if err != nil {
		return nil, err
	}

	return ds, nil
}
