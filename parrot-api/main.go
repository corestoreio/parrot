package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/Sirupsen/logrus"
	"github.com/parrot-translate/parrot/parrot-api/api"
	"github.com/parrot-translate/parrot/parrot-api/auth"
	"github.com/parrot-translate/parrot/parrot-api/config"
	"github.com/parrot-translate/parrot/parrot-api/datastore"
	"github.com/parrot-translate/parrot/parrot-api/logger"
	"github.com/pressly/chi"
	"github.com/pressly/chi/middleware"
)

const ConfigFileLocation = "./parrot_api.yaml"

func init() {
	// Config log
	logrus.SetOutput(os.Stdout)
	logrus.SetFormatter(&logrus.TextFormatter{})
	logrus.SetLevel(logrus.InfoLevel)
}

// TODO: refactor this into cli to start server
func main() {
	conf := mustLoadConf()

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

func mustLoadConf() *config.AppConfig {
	var conf *config.AppConfig

	// Check if config file exists
	_, err := os.Stat(ConfigFileLocation)
	// If not exists, load from environment
	if os.IsNotExist(err) {
		conf, err = config.FromEnv()
		if err != nil {
			logrus.Fatal(err)
		}
	} else {
		// If exists, load from file
		data, err := ioutil.ReadFile(ConfigFileLocation)
		if err != nil {
			logrus.Fatal(err)
		}

		conf, err = config.FromYaml(data)
		if err != nil {
			logrus.Fatal(err)
		}
	}

	// Set defaults if no value set
	config.SetOrDefault(conf)

	return conf
}
