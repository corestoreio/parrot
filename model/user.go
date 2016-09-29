package model

type UserStorer interface {
	GetUser(int) (*User, error)
	CreateUser(*User) error
	UpdateUser(*User) error
	DeleteUser(int) (int, error)
}

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email`
	Password string `json:"password`
	Role     string `json:"role"`
}
