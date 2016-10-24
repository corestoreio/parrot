package api

import (
	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/paths"
)

func (db *APIStore) GetDoc(id int) (*model.Document, error) {
	var doc model.Document
	err := db.request("GET", paths.DocumentsPath+"/"+string(id), nil, &doc)
	if err != nil {
		return nil, err
	}
	return &doc, errors.ErrNotImplemented
}

func (db *APIStore) CreateDoc(doc *model.Document) error {
	return errors.ErrNotImplemented
}

func (db *APIStore) UpdateDoc(doc *model.Document) error {
	return errors.ErrNotImplemented
}

func (db *APIStore) DeleteDoc(id int) (int, error) {
	return -1, errors.ErrNotImplemented
}
