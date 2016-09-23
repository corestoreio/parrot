package postgres

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type PostgresDB struct {
	*sql.DB
}
