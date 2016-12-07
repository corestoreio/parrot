package api

import (
	"net/http"

	"github.com/pressly/chi"
)

type Role string
type RoleGrant int
type Authorizer func(string) bool

const (
	OwnerRole  = "owner"
	EditorRole = "editor"
	ViewerRole = "viewer"
)

const (
	CanAssignRoles = iota
	CanRevokeRoles
	CanUpdateRoles
	CanViewProjectRoles
	CanUpdateProject
	CanDeleteProject
	CanViewProject
	CanCreateLocales
	CanUpdateLocales
	CanDeleteLocales
	CanViewLocales
)

var permissions = map[Role][]RoleGrant{
	OwnerRole: []RoleGrant{
		CanAssignRoles,
		CanRevokeRoles,
		CanUpdateRoles,
		CanViewProjectRoles,
		CanUpdateProject,
		CanDeleteProject,
		CanViewProject,
		CanCreateLocales,
		CanUpdateLocales,
		CanDeleteLocales,
		CanViewLocales,
	},
	EditorRole: []RoleGrant{
		CanViewProjectRoles,
		CanUpdateProject,
		CanViewProject,
		CanCreateLocales,
		CanUpdateLocales,
		CanDeleteLocales,
		CanViewLocales,
	},
	ViewerRole: []RoleGrant{
		CanViewProjectRoles,
		CanViewProject,
		CanViewLocales,
	},
}

func isRole(r string) bool {
	v := Role(r)
	switch v {
	case OwnerRole, EditorRole, ViewerRole:
		return true
	}
	return false
}

func isAllowed(r Role, a RoleGrant) bool {
	actions, ok := permissions[r]
	if !ok {
		return false
	}
	for _, currentAction := range actions {
		if currentAction == a {
			return true
		}
	}
	return false
}

func getProjectUserRole(userID, projID string) (string, error) {
	user, err := store.GetProjectUser(projID, userID)
	if err != nil {
		return "", err
	}
	return user.Role, nil
}

func mustAuthorize(action RoleGrant, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		projectID := chi.URLParam(r, "projectID")
		if projectID == "" {
			handleError(w, ErrBadRequest)
			return
		}
		// TODO:
		// 2 options, it's a user or an application
		// If user proceed as normal
		// If application, validate project application claim
		requesterID, err := getUserID(r.Context())
		if err != nil {
			handleError(w, ErrBadRequest)
			return
		}
		requesterRole, err := getProjectUserRole(requesterID, projectID)
		if err != nil {
			handleError(w, err)
			return
		}
		if !isAllowed(Role(requesterRole), action) {
			handleError(w, ErrForbiden)
			return
		}
		next.ServeHTTP(w, r)
	}
}
