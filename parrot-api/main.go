package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/parrot-api/api"
	"github.com/anthonynsimon/parrot/parrot-api/auth"
	"github.com/anthonynsimon/parrot/parrot-api/config"
	"github.com/anthonynsimon/parrot/parrot-api/datastore"
	"github.com/anthonynsimon/parrot/parrot-api/logger"
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
	conf, err := config.FromEnv()
	if err != nil {
		logrus.Fatal(err)
	}

	// init and ping datastore
	if conf.DBName == "" || conf.DBConn == "" {
		logrus.Fatal("Database not properly configured.")
	}

	ds, err := datastore.NewDatastore(conf.DBName, conf.DBConn)
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
		api.Cors,
		middleware.Recoverer,
		middleware.RequestID,
		middleware.RealIP,
		logger.Request,
		middleware.StripSlashes,
	)

	tp := auth.TokenProvider{Name: conf.AuthIssuer, SigningKey: []byte(conf.AuthSigningKey)}
	router.Mount("/api/v1/auth", auth.NewRouter(ds, tp))
	router.Mount("/api/v1", api.NewRouter(ds, tp))

	// config and init server
	bindInterface := ":" + conf.Port
	s := &http.Server{
		Addr:           bindInterface,
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	logrus.Info(fmt.Sprintf("server listening on %s", bindInterface))

	logrus.Fatal(s.ListenAndServe())
}

func blockAndRetry(d time.Duration, fn func() bool) {
	for !fn() {
		logrus.Infof("retrying in %s...\n", d.String())
		time.Sleep(d)
	}
}
