package postgres

import (
	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
)

func (db *PostgresDB) GetUser(id int) (*model.User, error) {
	u := model.User{}
	row := db.QueryRow("SELECT * FROM users WHERE id = $1", id)

	err := row.Scan(&u.ID, &u.Email, &u.Password)
	if err != nil {
		return nil, parseError(err)
	}

	return &u, nil
}

func (db *PostgresDB) GetUserByEmail(email string) (*model.User, error) {
	if email == "" {
		return nil, errors.ErrBadRequest
	}
	u := model.User{}
	row := db.QueryRow("SELECT * FROM users WHERE email = $1", email)

	err := row.Scan(&u.ID, &u.Email, &u.Password)
	if err != nil {
		return nil, parseError(err)
	}

	return &u, nil
}

func (db *PostgresDB) CreateUser(u *model.User) error {
	row := db.QueryRow("INSERT INTO users (email, password) VALUES($1, $2) RETURNING id", u.Email, u.Password)
	err := row.Scan(&u.ID)
	return parseError(err)
}

func (db *PostgresDB) UpdateUser(u *model.User) error {
	return errors.ErrNotImplemented
}

func (db *PostgresDB) DeleteUser(id int) (int, error) {
	err := db.QueryRow("DELETE FROM users WHERE id = $1 RETURNING id", id).Scan(&id)
	return id, parseError(err)
}
