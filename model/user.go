package model

import "errors"

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
	Validate() []error
}

func (u *User) Validate() []error {
	var errs []error
	if !ValidEmail(u.Email) {
		errs = append(errs, errors.New("email address is not valid"))
	}
	if !HasMinLength(u.Password, 8) {
		errs = append(errs, errors.New("password should be at least 8 characters long"))
	}
	return errs
}
