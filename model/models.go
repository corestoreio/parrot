package model

type DocStorer interface {
	GetDoc(id int) (*Document, error)
	CreateDoc(doc *Document) error
	UpdateDoc(doc *Document) error
	DeleteDoc(id int) (int, error)
}

func NewDocument(id int) *Document {
	return &Document{ID: id, Pairs: make(map[string]string)}
}

type Document struct {
	ID    int               `db:"id" json:"id"`
	Pairs map[string]string `db:"pairs" json:"pairs"`
}

func (d *Document) SyncKeys(t []string, additive bool) {
	if d.Pairs == nil || !additive {
		d.Pairs = make(map[string]string)
	}

	for _, v := range t {
		d.Pairs[v] = d.Pairs[v]
	}
}

type Project struct {
	ID    int            `db:"id" json:"id"`
	Keys  []string       `db:"keys" json:"keys"`
	Langs map[string]int `db:"langs" json:"langs"`
}
