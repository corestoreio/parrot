package api

import (
	"encoding/json"
	"net/http"

	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	"github.com/pressly/chi"
)

func createProject(w http.ResponseWriter, r *http.Request) {
	project := model.Project{}
	errs := decodeAndValidate(r.Body, &project)
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}
	userID, err := getUserIDFromContext(r.Context())
	if err != nil {
		handleError(w, err)
		return
	}

	result, err := store.CreateProject(project)
	if err != nil {
		handleError(w, err)
		return
	}
	pu := model.ProjectUser{ProjectID: result.ID, UserID: userID, Role: OwnerRole}
	err = store.AssignProjectUser(pu)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusCreated, result)
}

func updateProjectKeys(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}

	project := model.Project{}
	if err := json.NewDecoder(r.Body).Decode(&project.Keys); err != nil {
		handleError(w, err)
		return
	}
	project.ID = projectID
	project.SanitizeKeys()

	result, err := store.UpdateProject(project)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

func showProject(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}

	project, err := store.GetProject(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, project)
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}

	err := store.DeleteProject(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusNoContent, nil)
}
