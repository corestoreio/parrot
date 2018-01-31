package config

import (
	"os"

	"gopkg.in/yaml.v2"
)

type AppConfig struct {
	Port           string `yaml:"port"`
	DBName         string `yaml:"dbName"`
	DBConn         string `yaml:"dbConn"`
	AuthIssuer     string `yaml:"authIssuer"`
	AuthSigningKey string `yaml:"authSigningKey"`
}

func FromYaml(data []byte) (*AppConfig, error) {
	conf := &AppConfig{}
	err := yaml.Unmarshal(data, conf)
	if err != nil {
		return nil, err
	}
	return conf, nil
}

func SetOrDefault(conf *AppConfig) {
	if conf.Port == "" {
		conf.Port = "9990"
	}
	if conf.DBName == "" {
		conf.DBName = "postgres"
	}
	if conf.DBConn == "" {
		conf.DBConn = "postgres://postgres@localhost:5432/parrot?sslmode=disable"
	}
	if conf.AuthIssuer == "" {
		conf.AuthIssuer = "parrot@localhost"
	}
	if conf.AuthSigningKey == "" {
		conf.AuthSigningKey = "secret"
	}
}

func FromEnv() (*AppConfig, error) {
	port, ok := os.LookupEnv("PARROT_API_PORT")
	if !ok {
		port = "9990"
	}
	dbName, ok := os.LookupEnv("PARROT_DB_NAME")
	if !ok {
		dbName = "postgres"
	}
	dbConn, ok := os.LookupEnv("PARROT_DB_CONN")
	if !ok {
		dbConn = "postgres://postgres@localhost:5432/parrot?sslmode=disable"
	}
	authIssuer, ok := os.LookupEnv("PARROT_AUTH_ISSUER")
	if !ok {
		authIssuer = "parrot@localhost"
	}
	authSigningKey, ok := os.LookupEnv("PARROT_AUTH_SIGNING_KEY")
	if !ok {
		authSigningKey = "secret"
	}
	return &AppConfig{
		Port:           port,
		DBName:         dbName,
		DBConn:         dbConn,
		AuthIssuer:     authIssuer,
		AuthSigningKey: authSigningKey,
	}, nil
}
