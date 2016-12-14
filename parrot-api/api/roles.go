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
	ClientRole = "client"
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
	CanManageAPIClients
	CanExportLocales
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
		CanManageAPIClients,
		CanExportLocales,
	},
	EditorRole: []RoleGrant{
		CanViewProjectRoles,
		CanUpdateProject,
		CanViewProject,
		CanCreateLocales,
		CanUpdateLocales,
		CanDeleteLocales,
		CanViewLocales,
		CanExportLocales,
	},
	ViewerRole: []RoleGrant{
		CanViewProjectRoles,
		CanViewProject,
		CanViewLocales,
		CanExportLocales,
	},
	ClientRole: []RoleGrant{
		CanExportLocales,
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

func getProjectUserRole(projID, userID string) (string, error) {
	user, err := store.GetProjectUser(projID, userID)
	if err != nil {
		return "", err
	}
	return user.Role, nil
}

func mustBeProjectClient(projID, clientID string) error {
	client, err := store.GetProjectClient(projID, clientID)
	if err != nil || client == nil {
		return err
	}
	return nil
}

func mustAuthorize(action RoleGrant, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		projectID := chi.URLParam(r, "projectID")
		if projectID == "" {
			handleError(w, ErrBadRequest)
			return
		}

		ctx := r.Context()
		subType, err := getSubjectType(ctx)
		if err != nil {
			handleError(w, ErrBadRequest)
			return
		}
		requesterID, err := getSubjectID(ctx)
		if err != nil {
			handleError(w, ErrBadRequest)
			return
		}

		var requesterRole string

		switch subType {
		case UserSubject:
			requesterRole, err = getProjectUserRole(projectID, requesterID)
			if err != nil {
				handleError(w, err)
				return
			}
		case ClientSubject:
			err := mustBeProjectClient(projectID, requesterID)
			if err != nil {
				handleError(w, err)
				return
			}
			requesterRole = ClientRole
		default:
			handleError(w, ErrBadRequest)
			return
		}

		if !isAllowed(Role(requesterRole), action) {
			handleError(w, ErrForbiden)
			return
		}

		next.ServeHTTP(w, r)
	}
}
