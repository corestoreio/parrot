package model

type LocaleStorer interface {
	GetLocale(id int) (*Locale, error)
	CreateLocale(doc *Locale) error
	UpdateLocale(doc *Locale) error
	DeleteLocale(id int) (int, error)
}

type Locale struct {
	ID        int               `db:"id" json:"id"`
	Ident     string            `db:"ident" json:"ident"`
	Language  string            `db:"language" json:"language"`
	Country   string            `db:"country" json:"country"`
	Pairs     map[string]string `db:"pairs" json:"pairs"`
	ProjectID int               `db:"project_id" json:"project_id"`
}

// SyncKeys will add new keys from string slice t to document pairs.
func (d *Locale) SyncKeys(t []string) {
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
