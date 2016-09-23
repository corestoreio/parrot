package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/anthonynsimon/parrot/app"
	"github.com/anthonynsimon/parrot/datastore"
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
	router := app.New(ds)

	// init server
	s := &http.Server{
		Addr:           ":8080",
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

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
