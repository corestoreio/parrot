package postgres

import (
	"database/sql"
	goerrors "errors"

	"github.com/anthonynsimon/parrot/model"
	"github.com/lib/pq"
	"github.com/lib/pq/hstore"
)

func (db *PostgresDB) CreateLocale(loc model.Locale) (*model.Locale, error) {
	h := hstore.Hstore{}
	h.Map = make(map[string]sql.NullString)
	for k, v := range loc.Pairs {
		h.Map[k] = sql.NullString{String: v, Valid: true}
	}
	values, err := h.Value()
	if err != nil {
		return nil, parseError(err)
	}

	row := db.QueryRow("INSERT INTO locales (ident, language, country, pairs, project_id) VALUES($1, $2, $3, $4, $5) RETURNING id",
		loc.Ident, loc.Language, loc.Country, values, loc.ProjectID)
	err = row.Scan(&loc.ID)
	return &loc, parseError(err)
}

func (db *PostgresDB) RefactorProjectKey(projID, oldKey, newKey string) (int, error) {
	tx, err := db.Begin()
	if err != nil {
		return -1, parseError(err)
	}
	defer tx.Commit()

	// Step 1, get project keys and update
	row := tx.QueryRow("SELECT * from projects WHERE id = $1", projID)
	keys := pq.StringArray{}
	project := model.Project{}
	err = row.Scan(&project.ID, &project.Name, &keys)
	if err != nil {
		return -1, parseError(err)
	}

	project.Keys = make([]string, len(keys))
	for i, v := range keys {
		if v == oldKey {
			project.Keys[i] = newKey
		} else {
			project.Keys[i] = v
		}
	}

	newKeys := make(pq.StringArray, len(project.Keys))
	for i, v := range project.Keys {
		newKeys[i] = v
	}

	values, err := keys.Value()
	if err != nil {
		return -1, parseError(err)
	}

	_, err = tx.Exec("UPDATE projects SET keys = $1 WHERE id = $2", values, project.ID)
	if err != nil {
		return -1, parseError(err)
	}

	// Step 2, find all project locales and update pairs
	// TODO

	return -1, goerrors.New("not implemented")
}

func (db *PostgresDB) UpdateLocalePairs(projID string, localeIdent string, pairs map[string]string) (*model.Locale, error) {
	h := hstore.Hstore{}
	h.Map = make(map[string]sql.NullString)
	for k, v := range pairs {
		h.Map[k] = sql.NullString{String: v, Valid: true}
	}

	values, err := h.Value()
	if err != nil {
		return nil, err
	}

	row := db.QueryRow("UPDATE locales SET pairs = $1 WHERE project_id = $2 AND ident = $3 RETURNING *", values, projID, localeIdent)
	loc := model.Locale{}
	err = row.Scan(&loc.ID, &loc.Ident, &loc.Language, &loc.Country, &h, &loc.ProjectID)
	if err != nil {
		return nil, parseError(err)
	}

	loc.Pairs = make(map[string]string)
	for k, v := range h.Map {
		if v.Valid {
			loc.Pairs[k] = v.String
		}
	}
	return &loc, nil
}

func (db *PostgresDB) DeleteLocale(projID string, ident string) error {
	_, err := db.Exec("DELETE FROM locales WHERE project_id = $1 AND ident = $2", projID, ident)
	return parseError(err)
}
