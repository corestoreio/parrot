package postgres

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type PostgresDB struct {
	*sql.DB
}

func New(url string) (*PostgresDB, error) {
	conn, err := sql.Open("postgres", url)
	if err != nil {
		return nil, err
	}
	return &PostgresDB{conn}, nil
}

func (db *PostgresDB) Close() {
	db.Close()
}
