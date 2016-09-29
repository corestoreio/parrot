package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	"github.com/gorilla/mux"
)

func createProject(w http.ResponseWriter, r *http.Request) {
	project := &model.Project{}
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}

	err := store.CreateProject(project)
	if err != nil {
		render.JSONError(w, http.StatusInternalServerError)
		return
	}

	render.JSON(w, http.StatusCreated, project)
}

func showProject(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}

	project, err := store.GetProject(id)
	if err != nil {
		if err == errors.ErrNotFound {
			render.JSONError(w, http.StatusNotFound)
			return
		}
		render.JSONError(w, http.StatusInternalServerError)
		return
	}

	render.JSON(w, http.StatusOK, project)
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}

	resultID, err := store.DeleteProject(id)
	if err != nil {
		if err == errors.ErrNotFound {
			render.JSONError(w, http.StatusNotFound)
			return
		}
		render.JSONError(w, http.StatusInternalServerError)
		return
	}

	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("deleted project with id %d and all related documents", resultID),
	})
}
