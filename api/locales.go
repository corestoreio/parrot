package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	"github.com/pressly/chi"
)

func createLocale(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}

	loc := model.Locale{}
	errs := decodeAndValidate(r.Body, &loc)
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}
	loc.ProjectID = projectID

	proj, err := store.GetProject(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	loc.SyncKeys(proj.Keys)

	err = store.CreateLocale(&loc)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusCreated, loc)
}

func showLocale(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
	if err != nil {
		handleError(w, ErrBadRequest)
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
		handleError(w, ErrBadRequest)
		return

	}
	localeIdents := r.URL.Query()["ident"]

	locs, err := store.FindProjectLocales(projectID, localeIdents...)
	if err != nil {
		handleError(w, err)
		return
	}

	project, err := store.GetProject(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	for i := range locs {
		locs[i].SyncKeys(project.Keys)
	}

	render.JSON(w, http.StatusOK, locs)
}

func updateLocale(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}

	loc := &model.Locale{}
	if err := json.NewDecoder(r.Body).Decode(&loc); err != nil {
		handleError(w, ErrUnprocessable)
		return
	}
	loc.ID = id

	project, err := store.GetProject(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	loc.SyncKeys(project.Keys)

	err = store.UpdateLocale(loc)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, loc)
}

func deleteLocale(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}

	_, err = store.DeleteLocale(id)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusNoContent, nil)
}
