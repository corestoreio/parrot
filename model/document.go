package model

type DocStorer interface {
	GetDoc(id int) (*Document, error)
	CreateDoc(doc *Document) error
	UpdateDoc(doc *Document) error
	DeleteDoc(id int) (int, error)
}

func NewDocument(id int, locale string, pairs map[string]string) *Document {
	return &Document{ID: id, Locale: locale, Pairs: pairs}
}

type Document struct {
	ID        int               `db:"id" json:"id"`
	Locale    string            `db:"locale" json:"locale"`
	Pairs     map[string]string `db:"pairs" json:"pairs"`
	ProjectID int               `db:"project_id" json:"project_id"`
}

// SyncKeys will add new keys from string slice t to document pairs.
func (d *Document) SyncKeys(t []string) {
	if d.Pairs == nil {
		d.Pairs = make(map[string]string)
	}

	temp := make(map[string]string)

	// Assign each key, if it's already there it will simply reassign to there
	// previous value, otherwise an empty string will be set
	for _, v := range t {
		temp[v] = d.Pairs[v]
	}

	d.Pairs = temp
}
