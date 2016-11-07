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

func getUserProjects(w http.ResponseWriter, r *http.Request) {
	id, err := getUserIDFromContext(r.Context())
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	projects, err := store.GetUserProjects(id)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, projects)
}

func getProjectUsers(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		render.JSONError(w, errors.ErrBadRequest)
		return
	}

	users, err := store.GetProjectUsers(id)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, users)
}

func assignProjectUser(w http.ResponseWriter, r *http.Request) {
	var pu model.ProjectUser
	if err := json.NewDecoder(r.Body).Decode(&pu); err != nil {
		render.JSONError(w, errors.ErrBadRequest)
		return
	}

	err := store.AssignProjectUser(pu.ProjectID, pu.UserID)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, pu)
}

func revokeProjectUser(w http.ResponseWriter, r *http.Request) {
	var pu model.ProjectUser
	if err := json.NewDecoder(r.Body).Decode(&pu); err != nil {
		render.JSONError(w, errors.ErrBadRequest)
		return
	}
	// TODO: handle input validation

	err := store.RevokeProjectUser(pu.ProjectID, pu.UserID)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, pu)
}
