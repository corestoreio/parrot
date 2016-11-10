package postgres

import (
	"database/sql"

	"github.com/anthonynsimon/parrot/datastore/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/lib/pq"
	"github.com/lib/pq/hstore"
)

func (db *PostgresDB) GetProject(id int) (*model.Project, error) {
	p := model.Project{}
	row := db.QueryRow("SELECT * FROM projects WHERE id = $1", id)

	keys := pq.StringArray{}
	err := row.Scan(&p.ID, &p.Name, &keys)
	if err != nil {
		return nil, parseError(err)
	}

	p.Keys = make([]string, len(keys))
	for i, v := range keys {
		p.Keys[i] = v
	}

	return &p, nil
}

func (db *PostgresDB) CreateProject(project model.Project) (*model.Project, error) {
	keys := make(pq.StringArray, len(project.Keys))
	for i, v := range project.Keys {
		keys[i] = v
	}

	values, err := keys.Value()
	if err != nil {
		return nil, parseError(err)
	}

	row := db.QueryRow("INSERT INTO projects (name, keys) VALUES($1, $2) RETURNING *", project.Name, values)
	result := model.Project{}
	keys = pq.StringArray{}
	err = row.Scan(&result.ID, &result.Name, &keys)
	if err != nil {
		return nil, parseError(err)
	}

	result.Keys = make([]string, len(keys))
	for i, v := range keys {
		result.Keys[i] = v
	}

	return &result, nil
}

func (db *PostgresDB) UpdateProject(project model.Project) (*model.Project, error) {
	keys := make(pq.StringArray, len(project.Keys))
	for i, v := range project.Keys {
		keys[i] = v
	}

	values, err := keys.Value()
	if err != nil {
		return nil, parseError(err)
	}

	row := db.QueryRow("UPDATE projects SET keys = $1 WHERE id = $2 RETURNING *", values, project.ID)
	keys = pq.StringArray{}
	err = row.Scan(&project.ID, &project.Name, &keys)
	if err != nil {
		return nil, parseError(err)
	}

	project.Keys = make([]string, len(keys))
	for i, v := range keys {
		project.Keys[i] = v
	}

	return &project, nil
}

func (db *PostgresDB) DeleteProject(id int) error {
	_, err := db.Exec("DELETE FROM projects WHERE id = $1", id)
	if err == sql.ErrNoRows {
		return errors.ErrNotFound
	}
	return err
}

func (db *PostgresDB) GetProjectLocaleByIdent(projectID int, ident string) (*model.Locale, error) {
	loc := model.Locale{}
	row := db.QueryRow("SELECT * FROM locales WHERE project_id = $1 AND ident = $2", projectID, ident)
	pairs := hstore.Hstore{}
	err := row.Scan(&loc.ID, &loc.Ident, &loc.Language, &loc.Country, &pairs, &loc.ProjectID)
	if err != nil {
		return nil, parseError(err)
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
		return nil, parseError(err)
	}
	defer rows.Close()

	locs := make([]model.Locale, 0)
	for rows.Next() {
		loc := model.Locale{}
		pairs := hstore.Hstore{}

		err := rows.Scan(&loc.ID, &loc.Ident, &loc.Language, &loc.Country, &pairs, &loc.ProjectID)
		if err != nil {
			return nil, parseError(err)
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
		return nil, parseError(err)
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
