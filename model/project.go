package model

type ProjectStorer interface {
	GetProjects() ([]Project, error)
	GetProject(id int) (*Project, error)
	CreateProject(doc *Project) error
	UpdateProject(doc *Project) error
	DeleteProject(id int) (int, error)
}

type ProjectLocaleStorer interface {
	GetProjectLocale(projID, localeID int) (*Locale, error)
	FindProjectLocales(projID int, localeIdents ...string) ([]Locale, error)
}

type Project struct {
	ID   int      `db:"id" json:"id"`
	Name string   `db:"name" json:"name"`
	Keys []string `db:"keys" json:"keys"`
}
