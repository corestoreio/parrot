package model

type ProjectStorer interface {
	GetProjects() ([]Project, error)
	GetProject(int) (*Project, error)
	CreateProject(*Project) (Project, error)
	UpdateProject(*Project) error
	DeleteProject(int) (int, error)
}

type ProjectLocaleStorer interface {
	GetProjectLocale(projID, localeID int) (*Locale, error)
	FindProjectLocales(projID int, localeIdents ...string) ([]Locale, error)
}

type ProjectUserStorer interface {
	GetProjectUsers(projID int) ([]User, error)
	GetUserProjects(userID int) ([]Project, error)
	AssignProjectUser(projID, userID int) error
}

type Project struct {
	ID   int      `db:"id" json:"id"`
	Name string   `db:"name" json:"name"`
	Keys []string `db:"keys" json:"keys"`
}

type ProjectUser struct {
	ProjectID int `json:"project_id"`
	UserID    int `json:"user_id"`
}
