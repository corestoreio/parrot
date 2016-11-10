package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	"github.com/pressly/chi"
)

func getUserProjects(w http.ResponseWriter, r *http.Request) {
	id, err := getUserIDFromContext(r.Context())
	if err != nil {
		handleError(w, ErrInternal)
		return
	}

	projects, err := store.GetUserProjects(id)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, projects)
}

func getProjectUsers(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}

	users, err := store.GetProjectUsers(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, users)
}

func assignProjectUser(w http.ResponseWriter, r *http.Request) {
	// TODO: decode and validate only required fields. Whitelisting?
	var pu model.ProjectUser
	if err := json.NewDecoder(r.Body).Decode(&pu); err != nil {
		handleError(w, ErrBadRequest)
		return
	}
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}
	if projectID != pu.ProjectID {
		handleError(w, ErrForbiden)
		return
	}

	err = store.AssignProjectUser(pu)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, pu)
}

func updateProjectUser(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}
	userID, err := strconv.Atoi(chi.URLParam(r, "userID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}
	pu := model.ProjectUser{UserID: userID, ProjectID: projectID}
	// Get updated role
	if err := json.NewDecoder(r.Body).Decode(&pu); err != nil {
		handleError(w, ErrBadRequest)
		return
	}
	// Prevent the user setting a different id via body
	pu.ProjectID = projectID
	pu.UserID = userID

	result, err := store.UpdateProjectUser(pu)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

func revokeProjectUser(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}
	userID, err := strconv.Atoi(chi.URLParam(r, "userID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}
	pu := model.ProjectUser{UserID: userID, ProjectID: projectID}

	err = store.RevokeProjectUser(pu)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusNoContent, nil)
}
