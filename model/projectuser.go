package model

type ProjectUserStorer interface {
	GetProjectUsers(projID int) ([]User, error)
	GetUserProjects(userID int) ([]Project, error)
	GetProjectUserRoles(projID int) ([]ProjectUser, error)
	AssignProjectUser(ProjectUser) error
	RevokeProjectUser(ProjectUser) error
	UpdateProjectUser(ProjectUser) (*ProjectUser, error)
}

type ProjectUser struct {
	ProjectID int    `db:"project_id" json:"project_id"`
	UserID    int    `db:"user_id" json:"user_id"`
	Role      string `db:"role" json:"role"`
}
