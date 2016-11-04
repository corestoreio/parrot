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

func createLocale(w http.ResponseWriter, r *http.Request) error {
	projID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	loc := &model.Locale{}
	if err := json.NewDecoder(r.Body).Decode(&loc); err != nil {
		return errors.ErrBadRequest
	}

	loc.ProjectID = projID

	proj, err := store.GetProject(projID)
	if err != nil {
		return err
	}

	loc.SyncKeys(proj.Keys)

	err = store.CreateLocale(loc)
	if err != nil {
		return errors.ErrInternal
	}

	render.JSON(w, http.StatusCreated, loc)
	return nil
}

func showLocale(w http.ResponseWriter, r *http.Request) error {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest
	}
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	loc, err := store.GetProjectLocale(projectID, id)
	if err != nil {
		return err
	}

	proj, err := store.GetProject(projectID)
	if err != nil {
		return err
	}

	loc.SyncKeys(proj.Keys)

	render.JSON(w, http.StatusOK, loc)
	return nil
}

func findLocales(w http.ResponseWriter, r *http.Request) error {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest

	}
	localeIdents := r.URL.Query()["locale"]

	locs, err := store.FindProjectLocales(projectID, localeIdents...)
	if err != nil {
		return err
	}

	project, err := store.GetProject(projectID)
	if err != nil {
		return err
	}

	for i := range locs {
		locs[i].SyncKeys(project.Keys)
	}

	render.JSON(w, http.StatusOK, locs)
	return nil
}

func updateLocale(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
	if err != nil {
		return errors.ErrBadRequest
	}
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	loc := &model.Locale{}
	if err := json.NewDecoder(r.Body).Decode(&loc); err != nil {
		return errors.ErrBadRequest
	}
	loc.ID = id

	project, err := store.GetProject(projectID)
	if err != nil {
		return err
	}

	loc.SyncKeys(project.Keys)

	err = store.UpdateLocale(loc)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, loc)
	return nil
}

func deleteLocale(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "localeID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	resultID, err := store.DeleteLocale(id)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("deleted locale with id %d", resultID),
	})
	return nil
}
