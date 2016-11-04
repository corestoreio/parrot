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

func createProject(w http.ResponseWriter, r *http.Request) error {
	project := &model.Project{}
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		return errors.ErrBadRequest
	}

	err := store.CreateProject(project)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusCreated, project)
	return nil
}

func updateProject(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	project := &model.Project{}
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		return errors.ErrBadRequest
	}
	project.ID = id

	var sanitizedKeys []string
	for _, key := range project.Keys {
		if key == "" {
			continue
		}
		sanitizedKeys = append(sanitizedKeys, key)
	}

	project.Keys = sanitizedKeys

	err = store.UpdateProject(project)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, project)
	return nil
}

func showProject(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	project, err := store.GetProject(id)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, project)
	return nil
}

func showProjects(w http.ResponseWriter, r *http.Request) error {
	// TODO(anthonynsimon): only show projects for which user has permission
	projects, err := store.GetProjects()
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, projects)
	return nil
}

func deleteProject(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	resultID, err := store.DeleteProject(id)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("deleted project with id %d and all related locales", resultID),
	})
	return nil
}
