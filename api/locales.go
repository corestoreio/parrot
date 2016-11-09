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

func createLocale(w http.ResponseWriter, r *http.Request) {
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
	if !canCreateLocales(requesterRole) {
		handleError(w, errors.ErrForbiden)
		return
	}

	loc := model.Locale{}
	errs := decodeAndValidate(r.Body, &loc)
	if errs != nil {
		render.ErrorWithStatus(w, http.StatusBadRequest, errs)
		return
	}
	loc.ProjectID = projectID

	proj, err := store.GetProject(projectID)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	loc.SyncKeys(proj.Keys)

	err = store.CreateLocale(&loc)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusCreated, loc)
}

func showLocale(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
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
		handleError(w, err)
		return
	}
	if !canViewLocales(requesterRole) {
		handleError(w, errors.ErrForbiden)
		return
	}

	loc, err := store.GetProjectLocale(projectID, id)
	if err != nil {
		handleError(w, err)
		return
	}

	proj, err := store.GetProject(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	loc.SyncKeys(proj.Keys)

	render.JSON(w, http.StatusOK, loc)
}

func findLocales(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return

	}
	localeIdents := r.URL.Query()["ident"]

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
	if !canViewLocales(requesterRole) {
		handleError(w, errors.ErrForbiden)
		return
	}

	locs, err := store.FindProjectLocales(projectID, localeIdents...)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	project, err := store.GetProject(projectID)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	for i := range locs {
		locs[i].SyncKeys(project.Keys)
	}

	render.JSON(w, http.StatusOK, locs)
}

func updateLocale(w http.ResponseWriter, r *http.Request) {
	// TODO: reduce number of db calls
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
	if err != nil {
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
	if !canUpdateLocales(requesterRole) {
		handleError(w, errors.ErrForbiden)
		return
	}

	loc := &model.Locale{}
	if err := json.NewDecoder(r.Body).Decode(&loc); err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	loc.ID = id

	project, err := store.GetProject(projectID)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	loc.SyncKeys(project.Keys)

	err = store.UpdateLocale(loc)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, loc)
}

func deleteLocale(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, errors.ErrBadRequest)
		return
	}
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
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
	if !canDeleteLocales(requesterRole) {
		handleError(w, errors.ErrForbiden)
		return
	}

	resultID, err := store.DeleteLocale(id)
	if err != nil {
		handleError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("deleted locale with id %d", resultID),
	})
}

func canCreateLocales(role string) bool {
	switch role {
	case AdminRole, ContributorRole:
		return true
	}
	return false
}

func canUpdateLocales(role string) bool {
	switch role {
	case AdminRole, ContributorRole:
		return true
	}
	return false
}

func canDeleteLocales(role string) bool {
	switch role {
	case AdminRole:
		return true
	}
	return false
}

func canViewLocales(role string) bool {
	switch role {
	case AdminRole, ContributorRole, ReaderRole:
		return true
	}
	return false
}
