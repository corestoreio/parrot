package api

import (
	"encoding/json"
	"net/http"

	"strings"

	apiErrors "github.com/parrot-translate/parrot/parrot-api/errors"
	"github.com/parrot-translate/parrot/parrot-api/model"
	"github.com/parrot-translate/parrot/parrot-api/render"
	"github.com/pressly/chi"
)

type projectKeyPayload struct {
	Key string `json:"key"`
}

type projectKeyUpdatePayload struct {
	OldKey string `json:"oldKey"`
	NewKey string `json:"newKey"`
}

// createProject is an API endpoint for creating new projects.
func createProject(w http.ResponseWriter, r *http.Request) {
	project := model.Project{}
	errs := decodeAndValidate(r.Body, &project)
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}
	userID, err := getSubjectID(r.Context())
	if err != nil {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	// TODO: use a transaction for this
	result, err := store.CreateProject(project)
	if err != nil {
		handleError(w, err)
		return
	}
	pu := model.ProjectUser{ProjectID: result.ID, UserID: userID, Role: ownerRole}
	_, err = store.AssignProjectUser(pu)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusCreated, result)
}

// updateProjectName is an API endpoint for updating the name of a project.
func updateProjectName(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	project := model.Project{}
	errs := decodeAndValidate(r.Body, &project)
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}

	result, err := store.UpdateProjectName(projectID, project.Name)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

// addProjectKey is an API endpoint for adding keys ('strings') to a project.
func addProjectKey(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	var data = projectKeyPayload{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		handleError(w, err)
		return
	}

	if data.Key == "" {
		handleError(w, apiErrors.ErrUnprocessable)
		return
	}

	data.Key = strings.Trim(data.Key, " ")

	result, err := store.AddProjectKey(projectID, data.Key)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

// updateProjectKey is an API endpoint for renaming keys ('strings') in a project.
func updateProjectKey(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	var data = projectKeyUpdatePayload{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		handleError(w, err)
		return
	}

	if data.OldKey == "" || data.NewKey == "" {
		handleError(w, apiErrors.ErrUnprocessable)
		return
	}

	data.NewKey = strings.Trim(data.NewKey, "")

	project, localesAffected, err := store.UpdateProjectKey(projectID, data.OldKey, data.NewKey)
	if err != nil {
		handleError(w, err)
		return
	}

	result := map[string]interface{}{
		"localesAffected": localesAffected,
		"project":         project,
	}

	render.JSON(w, http.StatusOK, result)
}

// deleteProjectKey is an API endpoint for deleting keys ('strings') from a project.
func deleteProjectKey(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	keyName := chi.URLParam(r, "keyName")
	if keyName == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	result, err := store.DeleteProjectKey(projectID, keyName)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

// showProject is an API endpoint for retrieving a particular project.
func showProject(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	project, err := store.GetProject(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, project)
}

// deleteProject is an API endpoint for deleting a particular project.
func deleteProject(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	err := store.DeleteProject(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusNoContent, nil)
}
