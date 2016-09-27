package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/anthonynsimon/parrot/api"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/log"
	"github.com/joho/godotenv"
)

func main() {
	// init and ping datastore
	ds, err := initDatastore()
	if err != nil {
		log.Fatal(err)
	}
	defer ds.Close()
	if err = ds.Ping(); err != nil {
		log.Fatal(err)
	}

	// init app routes
	a := api.Handler(ds)

	// config
	addr := "localhost:8080"

	// init server
	s := &http.Server{
		Addr:           addr,
		Handler:        a,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Info(fmt.Sprintf("Listening on %s", addr))

	log.Fatal(s.ListenAndServe())
}

func initDatastore() (*datastore.Datastore, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	name := os.Getenv("DB")
	url := os.Getenv("DB_URL")

	ds, err := datastore.NewDatastore(name, url)
	if err != nil {
		return nil, err
	}

	return ds, nil
}
