package database

import (
	"errors"

	"github.com/anthonynsimon/parrot/model"
)

var (
	ErrNoDB = errors.New("couldn't get DB")
)

type Store interface {
	Ping() error
	Close()
	GetDoc(id int) (*model.Document, error)
	CreateDoc(doc *model.Document) error
	UpdateDoc(doc *model.Document) error
	DeleteDoc(id int) error
}
