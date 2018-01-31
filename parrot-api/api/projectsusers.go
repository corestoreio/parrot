package api

import (
	"encoding/json"
	"net/http"

	apiErrors "github.com/parrot-translate/parrot/parrot-api/errors"
	"github.com/parrot-translate/parrot/parrot-api/model"
	"github.com/parrot-translate/parrot/parrot-api/render"
	"github.com/pressly/chi"
)

// getUserProjects is an API endpoint for retrieving all projects that a user
// has access to.
func getUserProjects(w http.ResponseWriter, r *http.Request) {
	id, err := getSubjectID(r.Context())
	if err != nil {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	projects, err := store.GetUserProjects(id)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, projects)
}

// getProjectUsers is an API endpoint for retrieving all users with access to a project.
func getProjectUsers(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	projectUsers, err := store.GetProjectUsers(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	// Remove self user from slice
	id, err := getSubjectID(r.Context())
	if err != nil {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	result := make([]model.ProjectUser, 0)
	for _, pu := range projectUsers {
		if pu.UserID == id {
			continue
		}
		result = append(result, pu)
	}

	render.JSON(w, http.StatusOK, result)
}

// assignProjectUser is an API endpoint for giving an already registered user
// rights to access a project.
func assignProjectUser(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	// TODO: decode and validate only required fields. Whitelisting?
	var pu model.ProjectUser
	if err := json.NewDecoder(r.Body).Decode(&pu); err != nil {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	// Don't allow self editing
	id, err := getSubjectID(r.Context())
	if err != nil {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	if id == pu.UserID {
		handleError(w, apiErrors.ErrForbiden)
		return
	}

	// Validate that the url of the request matches the body data
	if projectID != pu.ProjectID {
		handleError(w, apiErrors.ErrForbiden)
		return
	}
	// If neither email nor user id is provided, there's nothing we can do
	if pu.Email == "" && pu.UserID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	// If email is provided, but no user id, find the user by email
	// Otherwise we already have the id, and no need to fetch data before the grant operation
	if pu.Email != "" && pu.UserID == "" {
		user, err := store.GetUserByEmail(pu.Email)
		if err != nil {
			handleError(w, err)
			return
		}
		pu.UserID = user.ID
	}

	result, err := store.AssignProjectUser(pu)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

// updateProjectUserRole is an API endpoint for changing a user's role in a project.
func updateProjectUserRole(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	userID := chi.URLParam(r, "userID")
	if userID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	// Get updated role
	data := struct {
		Role string `json:"role"`
	}{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	if !isRole(data.Role) {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	pu := model.ProjectUser{UserID: userID, ProjectID: projectID, Role: data.Role}

	result, err := store.UpdateProjectUser(pu)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

// revokeProjectUser is an API endpoint for removing a user's role from a project.
func revokeProjectUser(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	userID := chi.URLParam(r, "userID")
	if userID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	pu := model.ProjectUser{UserID: userID, ProjectID: projectID}

	err := store.RevokeProjectUser(pu)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusNoContent, nil)
}
