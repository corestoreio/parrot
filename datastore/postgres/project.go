package postgres

import (
	"github.com/anthonynsimon/parrot/model"
	"github.com/lib/pq"
)

func (db *PostgresDB) GetProject(id int) (*model.Project, error) {
	p := model.Project{}
	row := db.QueryRow("SELECT * FROM projects WHERE id = $1", id)

	keys := pq.StringArray{}
	err := row.Scan(&p.ID, &keys)
	if err != nil {
		return nil, err
	}

	p.Keys = make([]string, len(keys))
	for i, v := range keys {
		p.Keys[i] = v
	}

	return &p, nil
}

func (db *PostgresDB) CreateProject(project *model.Project) error {
	keys := make(pq.StringArray, len(project.Keys))
	for i, v := range project.Keys {
		keys[i] = v
	}

	values, err := keys.Value()
	if err != nil {
		return err
	}

	return db.QueryRow("INSERT INTO projects (keys) VALUES($1) RETURNING id", values).Scan(&project.ID)
}
