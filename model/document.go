package model

type DocStorer interface {
	GetDoc(id int) (*Document, error)
	CreateDoc(doc *Document) error
	UpdateDoc(doc *Document) error
	DeleteDoc(id int) (int, error)
}

type Document struct {
	ID    int               `db:"id" json:"id"`
	Pairs map[string]string `db:"pairs" json:"pairs" binding:"required"`
}
