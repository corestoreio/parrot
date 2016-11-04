package postgres

import (
	"database/sql"

	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/lib/pq"
)

func (db *PostgresDB) GetUserProjects(userID int) ([]model.Project, error) {
	rows, err := db.Query(`SELECT projects.*
							FROM projects
							JOIN projects_users ON projects.id = projects_users.project_id
							WHERE projects_users.user_id = $1`, userID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.ErrNotFound
		}
		return nil, err
	}
	defer rows.Close()

	projects := make([]model.Project, 0)
	for rows.Next() {
		p := model.Project{}
		keys := pq.StringArray{}

		err := rows.Scan(&p.ID, &p.Name, &keys)
		if err != nil {
			return nil, err
		}

		p.Keys = make([]string, len(keys))
		for i, v := range keys {
			p.Keys[i] = v
		}

		projects = append(projects, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return projects, nil
}

func (db *PostgresDB) GetProjectUsers(projID int) ([]model.User, error) {
	rows, err := db.Query(`SELECT users.*
							FROM users
							JOIN projects_users ON users.id = projects_users.user_id
							WHERE projects_users.project_id = $1`, projID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.ErrNotFound
		}
		return nil, err
	}
	defer rows.Close()

	users := make([]model.User, 0)
	for rows.Next() {
		u := model.User{}

		err := rows.Scan(&u.ID, &u.Email, &u.Password)
		if err != nil {
			return nil, err
		}
		u.Password = ""
		users = append(users, u)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (db *PostgresDB) AssignProjectUser(projID, userID int) error {
	err := db.QueryRow("INSERT INTO projects_users (project_id, user_id) VALUES($1, $2)",
		projID, userID).Scan()
	if err == sql.ErrNoRows {
		return nil
	}
	return err
}
