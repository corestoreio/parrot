package api

import (
	"encoding/json"
	"net/http"

	apiErrors "github.com/parrot-translate/parrot/parrot-api/errors"
	"github.com/parrot-translate/parrot/parrot-api/model"
	"github.com/parrot-translate/parrot/parrot-api/render"
	"github.com/pressly/chi"
)

type updateLocalePairsPayload struct {
	Pairs map[string]string `json:pairs`
}

// createLocale is an API endpoint for creating a new project locale.
func createLocale(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
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

	result, err := store.CreateLocale(loc)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusCreated, result)
}

// showLocale is an API endpoint for retrieving a project locale by ident.
func showLocale(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	ident := chi.URLParam(r, "localeIdent")
	if ident == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	loc, err := store.GetProjectLocaleByIdent(projectID, ident)
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

// findLocales is an API endpoint for retrieving project locales and filtering by ident.
func findLocales(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return

	}
	localeIdents := r.URL.Query()["ident"]

	locs, err := store.GetProjectLocales(projectID, localeIdents...)
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

// updateLocalePairs is an API endpoint for updating a locale's key value pairs.
func updateLocalePairs(w http.ResponseWriter, r *http.Request) {
	ident := chi.URLParam(r, "localeIdent")
	if ident == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	payload := &updateLocalePairsPayload{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		handleError(w, apiErrors.ErrUnprocessable)
		return
	}

	project, err := store.GetProject(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	loc := &model.Locale{Pairs: payload.Pairs}
	loc.SyncKeys(project.Keys)

	result, err := store.UpdateLocalePairs(projectID, ident, loc.Pairs)
	if err != nil {
		handleError(w, err)
		return
	}

	result.SyncKeys(project.Keys)

	render.JSON(w, http.StatusOK, result)
}

// deleteLocale is an API endpoint for deleting a project's locale.
func deleteLocale(w http.ResponseWriter, r *http.Request) {
	ident := chi.URLParam(r, "localeIdent")
	if ident == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	err := store.DeleteLocale(projectID, ident)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusNoContent, nil)
}
