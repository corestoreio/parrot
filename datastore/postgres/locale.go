package postgres

import (
	"database/sql"

	"github.com/anthonynsimon/parrot/model"
	"github.com/lib/pq/hstore"
)

func (db *PostgresDB) GetLocale(id int) (*model.Locale, error) {
	loc := model.Locale{}
	row := db.QueryRow("SELECT * FROM locales WHERE id = $1", id)
	pairs := hstore.Hstore{}
	err := row.Scan(&loc.ID, &loc.Ident, &pairs, &loc.ProjectID)
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

func (db *PostgresDB) CreateLocale(loc *model.Locale) error {
	h := hstore.Hstore{}
	h.Map = make(map[string]sql.NullString)
	for k, v := range loc.Pairs {
		h.Map[k] = sql.NullString{String: v, Valid: true}
	}
	values, err := h.Value()
	if err != nil {
		return parseError(err)
	}

	row := db.QueryRow("INSERT INTO locales (ident, language, country, pairs, project_id) VALUES($1, $2, $3, $4, $5) RETURNING id",
		loc.Ident, loc.Language, loc.Country, values, loc.ProjectID)
	err = row.Scan(&loc.ID)
	return parseError(err)
}

func (db *PostgresDB) UpdateLocale(loc *model.Locale) error {
	h := hstore.Hstore{}
	h.Map = make(map[string]sql.NullString)
	for k, v := range loc.Pairs {
		h.Map[k] = sql.NullString{String: v, Valid: true}
	}

	values, err := h.Value()
	if err != nil {
		return err
	}

	row := db.QueryRow("UPDATE locales SET pairs = $1 WHERE id = $2 RETURNING *", values, loc.ID)
	err = row.Scan(&loc.ID, &loc.Ident, &loc.Language, &loc.Country, &h, &loc.ProjectID)
	if err != nil {
		return parseError(err)
	}

	loc.Pairs = make(map[string]string)
	for k, v := range h.Map {
		if v.Valid {
			loc.Pairs[k] = v.String
		}
	}
	return nil
}

func (db *PostgresDB) DeleteLocale(id int) (int, error) {
	err := db.QueryRow("DELETE FROM locales WHERE id = $1 RETURNING id", id).Scan(&id)
	return id, parseError(err)
}
