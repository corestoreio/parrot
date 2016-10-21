package model

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
	Role     string `db:"role" json:"role"`
}
