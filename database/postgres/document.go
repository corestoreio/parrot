package postgres

import (
	"database/sql"

	"github.com/anthonynsimon/parrot/model"
	"github.com/lib/pq/hstore"
)

func (db *PostgresDB) GetDoc(id int) (*model.Document, error) {
	doc := model.Document{}
	row := db.QueryRow("SELECT * FROM documents WHERE id = $1", id)
	pairs := hstore.Hstore{}
	err := row.Scan(&doc.ID, &pairs)
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

func (db *PostgresDB) CreateDoc(doc *model.Document) error {
	h := hstore.Hstore{}
	h.Map = make(map[string]sql.NullString)
	for k, v := range doc.Pairs {
		h.Map[k] = sql.NullString{String: v, Valid: true}
	}
	values, err := h.Value()
	if err != nil {
		return err
	}

	return db.QueryRow("INSERT INTO documents (pairs) VALUES($1) RETURNING id", values).Scan(&doc.ID)
}

func (db *PostgresDB) UpdateDoc(doc *model.Document) error {
	h := hstore.Hstore{}
	h.Map = make(map[string]sql.NullString)
	for k, v := range doc.Pairs {
		h.Map[k] = sql.NullString{String: v, Valid: true}
	}

	values, err := h.Value()
	if err != nil {
		return err
	}

	return db.QueryRow("UPDATE documents SET pairs = pairs || $1 WHERE id = $2 RETURNING id", values, doc.ID).Scan(&doc.ID)
}

func (db *PostgresDB) DeleteDoc(id int) (int, error) {
	err := db.QueryRow("DELETE FROM documents WHERE id = $1 RETURNING id", id).Scan(&id)
	return id, err
}
