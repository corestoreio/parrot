package api

import (
	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/paths"
)

func (db *APIStore) GetUser(id int) (*model.User, error) {
	return nil, errors.ErrNotImplemented
}

func (db *APIStore) GetUserByEmail(email string) (*model.User, error) {
	return nil, errors.ErrNotImplemented
}

func (db *APIStore) CreateUser(u *model.User) error {
	_, err := db.request("POST", paths.UsersPath, u)
	if err != nil {
		return err
	}
	return nil
}

func (db *APIStore) UpdateUser(u *model.User) error {
	return errors.ErrNotImplemented
}

func (db *APIStore) DeleteUser(id int) (int, error) {
	return -1, errors.ErrNotImplemented
}
