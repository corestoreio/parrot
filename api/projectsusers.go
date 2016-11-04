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

func getUserProjects(w http.ResponseWriter, r *http.Request) error {
	id, err := getUserIDFromContext(r.Context())
	if err != nil {
		return err
	}

	projects, err := store.GetUserProjects(id)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, projects)
	return nil
}

func getProjectUsers(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	users, err := store.GetProjectUsers(id)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, users)
	return nil
}

func assignProjectUser(w http.ResponseWriter, r *http.Request) error {
	var pu model.ProjectUser
	if err := json.NewDecoder(r.Body).Decode(&pu); err != nil {
		return errors.ErrBadRequest
	}

	err := store.AssignProjectUser(pu.ProjectID, pu.UserID)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, pu)
	return nil
}
