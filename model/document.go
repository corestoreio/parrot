package model

type Document struct {
	ID    int               `db:"id" json:"id"`
	Pairs map[string]string `db:"pairs" json:"pairs" binding:"required"`
}

// func GetDocByID(db *sql.DB, id int) (*Document, error) {
// 	doc := Document{}
// 	row := db.QueryRow("SELECT * FROM documents WHERE id = $1", id)
// 	pairs := hstore.Hstore{}
// 	err := row.Scan(&doc.ID, &pairs)
// 	if err != nil {
// 		return nil, err
// 	}

// 	doc.Pairs = make(map[string]string)
// 	for k, v := range pairs.Map {
// 		if v.Valid {
// 			doc.Pairs[k] = v.String
// 		}
// 	}

// 	return &doc, nil
// }

// func CreateDoc(db *sql.DB, doc Document) (*Document, error) {
// 	h := hstore.Hstore{}
// 	h.Map = make(map[string]sql.NullString)
// 	for k, v := range doc.Pairs {
// 		h.Map[k] = sql.NullString{String: v, Valid: true}
// 	}
// 	values, err := h.Value()
// 	if err != nil {
// 		return nil, err
// 	}

// 	err = db.QueryRow("INSERT INTO documents (pairs) VALUES($1) RETURNING id", values).Scan(&doc.ID)
// 	return &doc, err
// }

// func UpdateDoc(db *sql.DB, doc Document) (*Document, error) {
// 	h := hstore.Hstore{}
// 	h.Map = make(map[string]sql.NullString)
// 	for k, v := range doc.Pairs {
// 		h.Map[k] = sql.NullString{String: v, Valid: true}
// 	}

// 	values, err := h.Value()
// 	if err != nil {
// 		return nil, err
// 	}

// 	resultPairs := hstore.Hstore{}
// 	row := db.QueryRow("UPDATE documents SET pairs = pairs || $1 WHERE id = $2 RETURNING id, pairs", values, doc.ID)
// 	err = row.Scan(&doc.ID, &resultPairs)
// 	if err != nil {
// 		return nil, err
// 	}

// 	doc.Pairs = make(map[string]string)
// 	for k, v := range resultPairs.Map {
// 		if v.Valid {
// 			doc.Pairs[k] = v.String
// 		}
// 	}

// 	return &doc, nil
// }

// func DeleteDoc(db *sql.DB, id int) (int, error) {
// 	var out int
// 	err := db.QueryRow("DELETE FROM documents WHERE id = $1 RETURNING id", id).Scan(&out)
// 	return out, err
// }
