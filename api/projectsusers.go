package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	"github.com/pressly/chi"
)

const (
	AdminRole       = "admin"
	ContributorRole = "contributor"
	ReaderRole      = "reader"
)

func getUserProjects(w http.ResponseWriter, r *http.Request) {
	id, err := getUserIDFromContext(r.Context())
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	projects, err := store.GetUserProjects(id)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, projects)
}

func getProjectUsers(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}

	// TODO refactor into middleware
	requesterID, err := getUserIDFromContext(r.Context())
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	requesterRole, err := getProjectUserRole(requesterID, projectID)
	if err != nil {
		handleError(w, errors.ErrForbiden)
		return
	}
	if !canViewProjectRoles(requesterRole) {
		handleError(w, errors.ErrForbiden)
		return
	}

	users, err := store.GetProjectUsers(projectID)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, users)
}

func assignProjectUser(w http.ResponseWriter, r *http.Request) {
	var pu model.ProjectUser
	if err := json.NewDecoder(r.Body).Decode(&pu); err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}

	requesterID, err := getUserIDFromContext(r.Context())
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	requesterRole, err := getProjectUserRole(requesterID, projectID)
	if err != nil {
		handleError(w, errors.ErrForbiden)
		return
	}
	if !canAssignRoles(requesterRole) {
		handleError(w, errors.ErrForbiden)
		return
	}

	err = store.AssignProjectUser(pu)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, pu)
}

func updateProjectUser(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	userID, err := strconv.Atoi(chi.URLParam(r, "userID"))
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	pu := model.ProjectUser{UserID: userID, ProjectID: projectID}
	// Get updated role
	if err := json.NewDecoder(r.Body).Decode(&pu); err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	// Prevent the user setting a different id via body
	pu.ProjectID = projectID
	pu.UserID = userID

	requesterID, err := getUserIDFromContext(r.Context())
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	requesterRole, err := getProjectUserRole(requesterID, projectID)
	if err != nil {
		handleError(w, errors.ErrForbiden)
		return
	}
	if !canUpdateRoles(requesterRole) {
		handleError(w, errors.ErrForbiden)
		return
	}

	result, err := store.UpdateProjectUser(pu)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

func revokeProjectUser(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	userID, err := strconv.Atoi(chi.URLParam(r, "userID"))
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	pu := model.ProjectUser{UserID: userID, ProjectID: projectID}

	requesterID, err := getUserIDFromContext(r.Context())
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	requesterRole, err := getProjectUserRole(requesterID, projectID)
	if err != nil {
		handleError(w, errors.ErrForbiden)
		return
	}
	if !canRevokeRoles(requesterRole) {
		handleError(w, errors.ErrForbiden)
		return
	}

	err = store.RevokeProjectUser(pu)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, pu)
}

func getProjectUserRole(userID, projID int) (string, error) {
	users, err := store.GetProjectUserRoles(projID)
	if err != nil {
		return "", err
	}
	for _, u := range users {
		if u.UserID == userID {
			return u.Role, nil
		}
	}
	return "", errors.ErrNotFound
}

func isProjectUser(userID, projID int) (bool, error) {
	users, err := store.GetProjectUsers(projID)
	if err != nil {
		return false, err
	}
	for _, u := range users {
		if u.ID == userID {
			return true, nil
		}
	}
	return false, nil
}

func canAssignRoles(role string) bool {
	switch role {
	case AdminRole:
		return true
	}
	return false
}

func canRevokeRoles(role string) bool {
	switch role {
	case AdminRole:
		return true
	}
	return false
}

func canUpdateRoles(role string) bool {
	switch role {
	case AdminRole:
		return true
	}
	return false
}

func canViewProjectRoles(role string) bool {
	switch role {
	case AdminRole, ContributorRole, ReaderRole:
		return true
	}
	return false
}
