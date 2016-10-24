package api

import (
	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
)

func (db *APIStore) GetProject(id int) (*model.Project, error) {
	return nil, errors.ErrNotImplemented
}

func (db *APIStore) CreateProject(project *model.Project) error {
	return errors.ErrNotImplemented
}

func (db *APIStore) UpdateProject(project *model.Project) error {
	return errors.ErrNotImplemented
}

func (db *APIStore) DeleteProject(id int) (int, error) {
	return -1, errors.ErrNotImplemented
}

func (db *APIStore) GetProjectDoc(projID, docID int) (*model.Document, error) {
	return nil, errors.ErrNotImplemented
}

func (db *APIStore) FindProjectDocs(projID int, locales ...string) ([]model.Document, error) {
	return nil, errors.ErrNotImplemented
}
