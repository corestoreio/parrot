package config

import (
	"os"
)

type AppConfig struct {
	Port              string
	DBName            string
	DBConn            string
	AuthIssuer        string
	AuthSigningKey    string
	MigrationStrategy string
}

// TODO: add config from conf file function
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
	migrationStrategy, ok := os.LookupEnv("PARROT_MIGRATION_STRATEGY")
	if !ok {
		migrationStrategy = "up"
	}
	return &AppConfig{
		Port:              port,
		DBName:            dbName,
		DBConn:            dbConn,
		AuthIssuer:        authIssuer,
		AuthSigningKey:    authSigningKey,
		MigrationStrategy: migrationStrategy,
	}, nil
}
