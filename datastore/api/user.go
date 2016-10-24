package api

import (
	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
)

func (db *APIStore) GetUser(id int) (*model.User, error) {
	return nil, errors.ErrNotImplemented
}

func (db *APIStore) GetUserByEmail(email string) (*model.User, error) {
	return nil, errors.ErrNotImplemented
}

func (db *APIStore) CreateUser(u *model.User) error {
	return errors.ErrNotImplemented
}

func (db *APIStore) UpdateUser(u *model.User) error {
	return errors.ErrNotImplemented
}

func (db *APIStore) DeleteUser(id int) (int, error) {
	return -1, errors.ErrNotImplemented
}
