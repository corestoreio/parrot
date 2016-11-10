package model

import "github.com/anthonynsimon/parrot/errors"

var (
	ErrInvalidLocaleIdent = &errors.Error{
		Type:    "InvalidLocaleIdent",
		Message: "invalid field locale ident"}
	ErrInvalidLocaleLanguage = &errors.Error{
		Type:    "InvalidLocaleLanguage",
		Message: "invalid field locale language"}
	ErrInvalidLocaleCountry = &errors.Error{
		Type:    "InvalidLocaleCountry",
		Message: "invalid field locale country"}
)

type LocaleStorer interface {
	CreateLocale(loc *Locale) error
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

func (l *Locale) Validate() error {
	var errs []errors.Error
	if !HasMinLength(l.Ident, 2) {
		errs = append(errs, *ErrInvalidLocaleIdent)
	}
	if !HasMinLength(l.Language, 1) {
		errs = append(errs, *ErrInvalidLocaleLanguage)
	}
	if !HasMinLength(l.Country, 1) {
		errs = append(errs, *ErrInvalidLocaleCountry)
	}
	if errs != nil {
		return NewValidationError(errs)
	}
	return nil
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
