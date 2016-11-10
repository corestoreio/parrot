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

func (db *PostgresDB) CreateUser(u *model.User) error {
	row := db.QueryRow("INSERT INTO users (email, password) VALUES($1, $2) RETURNING id", u.Email, u.Password)
	err := row.Scan(&u.ID)
	return parseError(err)
}

func (db *PostgresDB) DeleteUser(id int) (int, error) {
	err := db.QueryRow("DELETE FROM users WHERE id = $1 RETURNING id", id).Scan(&id)
	return id, parseError(err)
}
