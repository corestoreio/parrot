package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	"github.com/pressly/chi"
)

func createProject(w http.ResponseWriter, r *http.Request) {
	project := model.Project{}
	errs := decodeAndValidate(r.Body, &project)
	if errs != nil {
		render.ErrorWithStatus(w, http.StatusBadRequest, errs)
		return
	}
	userID, err := getUserIDFromContext(r.Context())
	if err != nil {
		render.Error(w, errors.ErrInternal)
		return
	}

	result, err := store.CreateProject(&project)
	if err != nil {
		render.Error(w, errors.ErrInternal)
		return
	}
	err = store.AssignProjectUser(result.ID, userID)
	if err != nil {
		render.Error(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusCreated, result)
}

func updateProject(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		render.Error(w, errors.ErrBadRequest)
		return
	}

	project := model.Project{}
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		render.Error(w, errors.ErrBadRequest)
		return
	}
	project.ID = id
	project.SanitizeKeys()

	err = store.UpdateProject(&project)
	if err != nil {
		render.Error(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, project)
}

func showProject(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		render.Error(w, errors.ErrBadRequest)
		return
	}

	project, err := store.GetProject(id)
	if err != nil {
		render.Error(w, err)
		return
	}

	render.JSON(w, http.StatusOK, project)
}

func showProjects(w http.ResponseWriter, r *http.Request) {
	// TODO(anthonynsimon): only show projects for which user has permission
	projects, err := store.GetProjects()
	if err != nil {
		render.Error(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, projects)
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		render.Error(w, errors.ErrBadRequest)
		return
	}

	resultID, err := store.DeleteProject(id)
	if err != nil {
		render.Error(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("deleted project with id %d and all related locales", resultID),
	})
}
