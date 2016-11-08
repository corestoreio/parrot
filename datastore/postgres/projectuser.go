package postgres

import (
	"github.com/anthonynsimon/parrot/model"
	"github.com/lib/pq"
)

func (db *PostgresDB) GetUserProjects(userID int) ([]model.Project, error) {
	rows, err := db.Query(`SELECT projects.*
							FROM projects
							JOIN projects_users ON projects.id = projects_users.project_id
							WHERE projects_users.user_id = $1`, userID)
	if err != nil {
		return nil, parseError(err)
	}
	defer rows.Close()

	projects := make([]model.Project, 0)
	for rows.Next() {
		p := model.Project{}
		keys := pq.StringArray{}

		err := rows.Scan(&p.ID, &p.Name, &keys)
		if err != nil {
			return nil, parseError(err)
		}

		p.Keys = make([]string, len(keys))
		for i, v := range keys {
			p.Keys[i] = v
		}

		projects = append(projects, p)
	}

	if err := rows.Err(); err != nil {
		return nil, parseError(err)
	}

	return projects, nil
}

func (db *PostgresDB) GetProjectUsers(projID int) ([]model.User, error) {
	rows, err := db.Query(`SELECT users.*
							FROM users
							JOIN projects_users ON users.id = projects_users.user_id
							WHERE projects_users.project_id = $1`, projID)
	if err != nil {
		return nil, parseError(err)
	}
	defer rows.Close()

	users := make([]model.User, 0)
	for rows.Next() {
		u := model.User{}

		err := rows.Scan(&u.ID, &u.Email, &u.Password)
		if err != nil {
			return nil, parseError(err)
		}
		u.Password = ""
		users = append(users, u)
	}

	if err := rows.Err(); err != nil {
		return nil, parseError(err)
	}

	return users, nil
}

func (db *PostgresDB) AssignProjectUser(pu model.ProjectUser) error {
	_, err := db.Exec("INSERT INTO projects_users (project_id, user_id, role) VALUES($1, $2, $3)",
		pu.ProjectID, pu.UserID, pu.Role)
	return parseError(err)
}

func (db *PostgresDB) RevokeProjectUser(pu model.ProjectUser) error {
	_, err := db.Exec("DELETE FROM projects_users WHERE project_id = $1 AND user_id = $2",
		pu.ProjectID, pu.UserID)
	return parseError(err)
}

func (db *PostgresDB) UpdateProjectUser(pu model.ProjectUser) (*model.ProjectUser, error) {
	var result model.ProjectUser
	row := db.QueryRow("UPDATE project_users SET role = $1 WHERE project_id = $2 AND user_id = $3 RETURNING *",
		pu.Role, pu.ProjectID, pu.UserID)
	err := row.Scan(&result)
	if err != nil {
		return nil, parseError(err)
	}
	return &result, nil
}
