package model

import (
	"net/http"

	"github.com/anthonynsimon/parrot/errors"
)

var (
	ErrInvalidEmail = errors.New(
		http.StatusBadRequest,
		"InvalidEmail",
		"invalid email")
	ErrInvalidPassword = errors.New(
		http.StatusBadRequest,
		"InvalidPassword",
		"invalid password")
)

type UserStorer interface {
	GetUser(int) (*User, error)
	GetUserByEmail(string) (*User, error)
	CreateUser(*User) error
	UpdateUser(*User) error
	DeleteUser(int) (int, error)
}

type User struct {
	ID       int    `db:"id" json:"id"`
	Email    string `db:"email" json:"email"`
	Password string `db:"password" json:"password,omitempty"`
}

type Validatable interface {
	Validate() error
}

func (u *User) Validate() error {
	var errs []errors.Error
	if !ValidEmail(u.Email) {
		errs = append(errs, *ErrInvalidEmail)
	}
	if !HasMinLength(u.Password, 8) {
		errs = append(errs, *ErrInvalidPassword)
	}
	return &errors.MultiError{Errors: errs}
}
