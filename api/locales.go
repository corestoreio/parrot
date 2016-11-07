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
	projID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		render.JSONError(w, errors.ErrBadRequest)
		return
	}

	loc := model.Locale{}
	errs := decodeAndValidate(r.Body, &loc)
	if errs != nil {
		render.JSON(w, http.StatusBadRequest, map[string]interface{}{
			"errors": errors.ErrorSliceToJSON(errs),
		})
		return
	}
	loc.ProjectID = projID

	proj, err := store.GetProject(projID)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	loc.SyncKeys(proj.Keys)

	err = store.CreateLocale(&loc)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusCreated, loc)
}

func showLocale(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		render.JSONError(w, errors.ErrBadRequest)
		return
	}
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
	if err != nil {
		render.JSONError(w, errors.ErrBadRequest)
		return
	}

	loc, err := store.GetProjectLocale(projectID, id)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	proj, err := store.GetProject(projectID)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	loc.SyncKeys(proj.Keys)

	render.JSON(w, http.StatusOK, loc)
}

func findLocales(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		render.JSONError(w, errors.ErrBadRequest)
		return

	}
	localeIdents := r.URL.Query()["locale"]

	locs, err := store.FindProjectLocales(projectID, localeIdents...)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	project, err := store.GetProject(projectID)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
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
		render.JSONError(w, errors.ErrBadRequest)
		return
	}
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		render.JSONError(w, errors.ErrBadRequest)
		return
	}

	loc := &model.Locale{}
	if err := json.NewDecoder(r.Body).Decode(&loc); err != nil {
		render.JSONError(w, errors.ErrBadRequest)
		return
	}
	loc.ID = id

	project, err := store.GetProject(projectID)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	loc.SyncKeys(project.Keys)

	err = store.UpdateLocale(loc)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, loc)
}

func deleteLocale(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
	if err != nil {
		render.JSONError(w, errors.ErrBadRequest)
		return
	}

	resultID, err := store.DeleteLocale(id)
	if err != nil {
		render.JSONError(w, errors.ErrInternal)
		return
	}

	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("deleted locale with id %d", resultID),
	})
}
