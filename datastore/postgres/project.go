package postgres

import (
	"github.com/anthonynsimon/parrot/model"
	"github.com/lib/pq"
	"github.com/lib/pq/hstore"
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

func (db *PostgresDB) GetProjectDoc(projID, docID int) (*model.Document, error) {
	row := db.QueryRow("SELECT * FROM documents WHERE project_id = $1 AND id = $2", projID, docID)
	doc := model.Document{}
	pairs := hstore.Hstore{}
	err := row.Scan(&doc.ID, &doc.Locale, &pairs, &doc.ProjectID)
	if err != nil {
		return nil, err
	}

	doc.Pairs = make(map[string]string)
	for k, v := range pairs.Map {
		if v.Valid {
			doc.Pairs[k] = v.String
		}
	}

	return &doc, nil
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

func (db *PostgresDB) DeleteProject(id int) (int, error) {
	err := db.QueryRow("DELETE FROM projects WHERE id = $1 RETURNING id", id).Scan(&id)
	return id, err
}
