package model

import "github.com/anthonynsimon/parrot/parrot-api/errors"

var (
	ErrInvalidClientName = &errors.Error{
		Type:    "InvalidClientName",
		Message: "invalid field name"}
	ErrInvalidProjectID = &errors.Error{
		Type:    "InvalidProjectID",
		Message: "invalid field project_id"}
)

type ProjectClient struct {
	ClientID  string `db:"client_id" json:"client_id"`
	Name      string `db:"name" json:"name"`
	Secret    string `db:"secret" json:"secret,omitempty"`
	ProjectID string `db:"project_id" json:"project_id"`
}

type ProjectClientStorer interface {
	GetProjectClients(string) ([]ProjectClient, error)
	GetProjectClient(projectID, clientID string) (*ProjectClient, error)
	CreateProjectClient(ProjectClient) (*ProjectClient, error)
	UpdateProjectClientSecret(ProjectClient) (*ProjectClient, error)
	UpdateProjectClientName(ProjectClient) (*ProjectClient, error)
	DeleteProjectClient(projectID, clientID string) error
}

func (p *ProjectClient) Validate() error {
	var errs []errors.Error
	if !HasMinLength(p.Name, 1) {
		errs = append(errs, *ErrInvalidClientName)
	}
	if errs != nil {
		return NewValidationError(errs)
	}
	return nil
}
