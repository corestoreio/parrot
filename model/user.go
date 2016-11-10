package model

import "github.com/anthonynsimon/parrot/errors"

var (
	ErrInvalidEmail = &errors.Error{
		Type:    "InvalidEmail",
		Message: "invalid email"}
	ErrInvalidPassword = &errors.Error{
		Type:    "InvalidPassword",
		Message: "invalid password"}
)

type UserStorer interface {
	GetUserByEmail(string) (*User, error)
	CreateUser(*User) error
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
	if errs != nil {
		return NewValidationError(errs)
	}
	return nil
}
