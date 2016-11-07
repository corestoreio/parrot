package postgres

import (
	"database/sql"

	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/lib/pq"
	"github.com/lib/pq/hstore"
)

func (db *PostgresDB) GetProjects() ([]model.Project, error) {
	rows, err := db.Query("SELECT * FROM projects")
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

func (db *PostgresDB) GetProject(id int) (*model.Project, error) {
	p := model.Project{}
	row := db.QueryRow("SELECT * FROM projects WHERE id = $1", id)

	keys := pq.StringArray{}
	err := row.Scan(&p.ID, &p.Name, &keys)
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

func (db *PostgresDB) CreateProject(project *model.Project) (model.Project, error) {
	keys := make(pq.StringArray, len(project.Keys))
	for i, v := range project.Keys {
		keys[i] = v
	}

	values, err := keys.Value()
	if err != nil {
		return model.Project{}, err
	}

	row := db.QueryRow("INSERT INTO projects (name, keys) VALUES($1, $2) RETURNING *", project.Name, values)
	result := model.Project{}
	keys = pq.StringArray{}
	err = row.Scan(&result.ID, &result.Name, &keys)
	if err != nil {
		if err == sql.ErrNoRows {
			return model.Project{}, errors.ErrNotFound
		}
		return model.Project{}, err
	}

	result.Keys = make([]string, len(keys))
	for i, v := range keys {
		result.Keys[i] = v
	}

	return result, nil
}

// TODO: handle project name update and non destructive key updating?
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
	err = row.Scan(&project.ID, &project.Name, &keys)
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

func (db *PostgresDB) GetProjectLocale(projID, docID int) (*model.Locale, error) {
	row := db.QueryRow("SELECT * FROM locales WHERE project_id = $1 AND id = $2", projID, docID)
	loc := model.Locale{}
	pairs := hstore.Hstore{}
	err := row.Scan(&loc.ID, &loc.Ident, &loc.Language, &loc.Country, &pairs, &loc.ProjectID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.ErrNotFound
		}
		return nil, err
	}

	loc.Pairs = make(map[string]string)
	for k, v := range pairs.Map {
		if v.Valid {
			loc.Pairs[k] = v.String
		}
	}

	return &loc, nil
}

func (db *PostgresDB) FindProjectLocales(projID int, localeIdents ...string) ([]model.Locale, error) {
	rows, err := db.Query("SELECT * FROM locales WHERE project_id = $1", projID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.ErrNotFound
		}
		return nil, err
	}
	defer rows.Close()

	var locs []model.Locale
	for rows.Next() {
		loc := model.Locale{}
		pairs := hstore.Hstore{}

		err := rows.Scan(&loc.ID, &loc.Ident, &loc.Language, &loc.Country, &pairs, &loc.ProjectID)
		if err != nil {
			return nil, err
		}

		loc.Pairs = make(map[string]string)
		for k, v := range pairs.Map {
			if v.Valid {
				loc.Pairs[k] = v.String
			}
		}

		locs = append(locs, loc)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(localeIdents) > 0 {
		locs = filterLocales(locs, func(doc model.Locale) bool {
			for _, locIdent := range localeIdents {
				if doc.Ident == locIdent {
					return true
				}
			}
			return false
		})
	}

	return locs, nil
}

func filterLocales(locs []model.Locale, fn func(model.Locale) bool) []model.Locale {
	result := make([]model.Locale, 0)
	for _, v := range locs {
		if fn(v) {
			result = append(result, v)
		}
	}
	return result
}
