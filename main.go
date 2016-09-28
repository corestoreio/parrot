package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"log"

	"github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/api"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/joho/godotenv"
)

func init() {
	// Config log
	logrus.SetFormatter(&logrus.TextFormatter{})
}

func main() {
	// init and ping datastore
	ds, err := initDatastore()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	defer ds.Close()
	if err = ds.Ping(); err != nil {
		fmt.Println(err)
		os.Exit(1)
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

	fmt.Println(fmt.Sprintf("Listening on %s", addr))

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
