package postgres

import (
	"database/sql"

	"github.com/anthonynsimon/parrot/errors"
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
		if err == sql.ErrNoRows {
			return nil, errors.ErrNotFound
		}
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

func (db *PostgresDB) UpdateProject(project *model.Project) error {
	keys := make(pq.StringArray, len(project.Keys))
	for i, v := range project.Keys {
		keys[i] = v
	}

	values, err := keys.Value()
	if err != nil {
		return err
	}

	row := db.QueryRow("UPDATE projects SET keys = $1 WHERE id = $2 RETURNING *", values, project.ID)
	keys = pq.StringArray{}
	err = row.Scan(&project.ID, &keys)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.ErrNotFound
		}
		return err
	}

	project.Keys = make([]string, len(keys))
	for i, v := range keys {
		project.Keys[i] = v
	}

	return nil
}

func (db *PostgresDB) DeleteProject(id int) (int, error) {
	err := db.QueryRow("DELETE FROM projects WHERE id = $1 RETURNING id", id).Scan(&id)
	if err == sql.ErrNoRows {
		return -1, errors.ErrNotFound
	}
	return id, err
}

func (db *PostgresDB) GetProjectDoc(projID, docID int) (*model.Document, error) {
	row := db.QueryRow("SELECT * FROM documents WHERE project_id = $1 AND id = $2", projID, docID)
	doc := model.Document{}
	pairs := hstore.Hstore{}
	err := row.Scan(&doc.ID, &doc.Locale, &pairs, &doc.ProjectID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.ErrNotFound
		}
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

func (db *PostgresDB) FindProjectDocs(projID int, locales ...string) ([]model.Document, error) {
	rows, err := db.Query("SELECT * FROM documents WHERE project_id = $1", projID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.ErrNotFound
		}
		return nil, err
	}
	defer rows.Close()

	docs := make([]model.Document, 0)
	for rows.Next() {
		doc := model.Document{}
		pairs := hstore.Hstore{}

		err := rows.Scan(&doc.ID, &doc.Locale, &pairs, &doc.ProjectID)
		if err != nil {
			return nil, err
		}

		doc.Pairs = make(map[string]string)
		for k, v := range pairs.Map {
			if v.Valid {
				doc.Pairs[k] = v.String
			}
		}

		docs = append(docs, doc)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(locales) > 0 {
		docs = filterDocs(docs, func(doc model.Document) bool {
			for _, locale := range locales {
				if doc.Locale == locale {
					return true
				}
			}
			return false
		})
	}

	return docs, nil
}

func filterDocs(docs []model.Document, fn func(model.Document) bool) []model.Document {
	result := make([]model.Document, 0)
	for _, v := range docs {
		if fn(v) {
			result = append(result, v)
		}
	}
	return result
}
