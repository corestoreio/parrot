package postgres

import "github.com/anthonynsimon/parrot/model"

func (db *PostgresDB) GetUserByEmail(email string) (*model.User, error) {
	u := model.User{}
	row := db.QueryRow("SELECT * FROM users WHERE email = $1", email)

	err := row.Scan(&u.ID, &u.Email, &u.Password)
	if err != nil {
		return nil, parseError(err)
	}

	return &u, nil
}

func (db *PostgresDB) CreateUser(u model.User) (*model.User, error) {
	row := db.QueryRow("INSERT INTO users (email, password) VALUES($1, $2) RETURNING id, email", u.Email, u.Password)
	err := row.Scan(&u.ID, &u.Email)
	return &u, parseError(err)
}
