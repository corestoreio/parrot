package model

type ProjectStorer interface {
	GetProject(id int) (*Project, error)
	CreateProject(doc *Project) error
	// UpdateProject(doc *Project) error
	DeleteProject(id int) (int, error)
}

type ProjectDocStorer interface {
	GetProjectDoc(projID, docID int) (*Document, error)
}

type Project struct {
	ID   int      `db:"id" json:"id"`
	Keys []string `db:"keys" json:"keys"`
}
