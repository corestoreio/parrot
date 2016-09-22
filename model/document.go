package model

type Document struct {
	ID    int               `db:"id" json:"id"`
	Pairs map[string]string `db:"pairs" json:"pairs" binding:"required"`
}
