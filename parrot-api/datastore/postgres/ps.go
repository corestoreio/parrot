// Package postgres holds an implementation of the datastore.Store.
package postgres

import "database/sql"

// PostgresDB implements the datastore.Store interface for a Postgres Database.
type PostgresDB struct {
	*sql.DB
}
