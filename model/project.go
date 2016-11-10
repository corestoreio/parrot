package model

import "github.com/anthonynsimon/parrot/errors"

var (
	ErrInvalidProjectName = &errors.Error{
		Type:    "InvalidProjectName",
		Message: "invalid field project name"}
)

type ProjectStorer interface {
	GetProject(int) (*Project, error)
	CreateProject(Project) (*Project, error)
	UpdateProject(Project) (*Project, error)
	DeleteProject(int) error
}

type ProjectLocaleStorer interface {
	UpdateLocalePairs(projID int, localeIdent string, pairs map[string]string) (*Locale, error)
	GetProjectLocaleByIdent(projID int, localeIdent string) (*Locale, error)
	GetProjectLocales(projID int, localeIdents ...string) ([]Locale, error)
}

type Project struct {
	ID   int      `db:"id" json:"id"`
	Name string   `db:"name" json:"name"`
	Keys []string `db:"keys" json:"keys"`
}

func (p *Project) SanitizeKeys() {
	var sk []string
	for _, key := range p.Keys {
		if key == "" {
			continue
		}
		sk = append(sk, key)
	}

	p.Keys = sk
}

func (p *Project) Validate() error {
	var errs []errors.Error
	if !HasMinLength(p.Name, 1) {
		errs = append(errs, *ErrInvalidProjectName)
	}
	if errs != nil {
		return NewValidationError(errs)
	}
	return nil
}
