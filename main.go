package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/anthonynsimon/parrot/app"
	"github.com/anthonynsimon/parrot/config"
	"github.com/anthonynsimon/parrot/database"
	"github.com/anthonynsimon/parrot/database/postgres"
	"github.com/joho/godotenv"
)

func main() {
	env, err := configEnv()
	if err != nil {
		log.Fatal(err)
	}
	defer env.DB.Close()

	router := app.New(env)

	s := &http.Server{
		Addr:           ":8080",
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Fatal(s.ListenAndServe())
}

func configEnv() (*config.Env, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	var db database.Store
	switch os.Getenv("DB") {
	case "postgres":
		db, err = postgres.New(os.Getenv("DB_URL"))
	default:
		err = errors.New("database not implemented")
	}
	if err != nil {
		return nil, err
	}

	return &config.Env{DB: db}, nil
}
