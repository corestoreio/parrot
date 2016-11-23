package model

type ProjectUserStorer interface {
	GetProjectUsers(projID string) ([]User, error)
	GetUserProjects(userID string) ([]Project, error)
	GetProjectUserRoles(projID string) ([]ProjectUser, error)
	AssignProjectUser(ProjectUser) error
	RevokeProjectUser(ProjectUser) error
	UpdateProjectUser(ProjectUser) (*ProjectUser, error)
}

type ProjectUser struct {
	ProjectID string `db:"project_id" json:"project_id"`
	UserID    string `db:"user_id" json:"user_id"`
	Role      string `db:"role" json:"role"`
}
