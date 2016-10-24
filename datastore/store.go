package datastore

import (
	"database/sql"
	"errors"

	"github.com/anthonynsimon/parrot/datastore/api"
	"github.com/anthonynsimon/parrot/datastore/postgres"
	"github.com/anthonynsimon/parrot/model"
)

type Store interface {
	model.DocStorer
	model.ProjectStorer
	model.ProjectDocStorer
	model.UserStorer
	Ping() error
	Close() error
}

var (
	ErrNoDB           = errors.New("couldn't get DB")
	ErrNotImplemented = errors.New("database not implemented")
)

type Datastore struct {
	Store
}

func NewDatastore(name string, url string) (*Datastore, error) {
	var ds *Datastore

	switch name {
	case "postgres":
		conn, err := sql.Open("postgres", url)
		if err != nil {
			return nil, err
		}
		p := &postgres.PostgresDB{DB: conn}
		// TODO(anthonynsimon): debug refused connections when db connections > 1
		p.SetMaxIdleConns(1)
		p.SetMaxOpenConns(1)
		ds = &Datastore{p}
	case "apiClient":
		apiBackend := api.New(url)
		ds = &Datastore{apiBackend}
	default:
		return nil, ErrNotImplemented
	}

	return ds, nil
}
