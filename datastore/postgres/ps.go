package postgres

import "database/sql"

type PostgresDB struct {
	*sql.DB
}
