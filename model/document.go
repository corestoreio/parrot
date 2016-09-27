package model

type DocStorer interface {
	GetDoc(id int) (*Document, error)
	CreateDoc(doc *Document) error
	UpdateDoc(doc *Document) error
	DeleteDoc(id int) (int, error)
}

func NewDocument(id int, lang string, pairs map[string]string) *Document {
	return &Document{ID: id, Language: lang, Pairs: pairs}
}

type Document struct {
	ID        int               `db:"id" json:"id"`
	Language  string            `db:"language" json:"language"`
	Pairs     map[string]string `db:"pairs" json:"pairs"`
	ProjectID int               `db:"project_id" json:"project_id"`
}

// SyncKeys will add new keys from string slice t to document pairs.
// If additive is set to false, previous key/value pairs will be destroyed,
// and if set to true they will be kept.
func (d *Document) SyncKeys(t []string, additive bool) {
	if d.Pairs == nil || !additive {
		d.Pairs = make(map[string]string)
	}

	// Assign each key, if it's already there it will simply reassign to there
	// previous value, otherwise an empty string will be set
	for _, v := range t {
		d.Pairs[v] = d.Pairs[v]
	}
}
