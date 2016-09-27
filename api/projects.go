package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/anthonynsimon/parrot/model"
	"github.com/gorilla/mux"
)

func CreateProject(w http.ResponseWriter, r *http.Request) (int, error) {
	project := &model.Project{}
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		return http.StatusBadRequest, err
	}

	err := store.CreateProject(project)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return writeJSON(w, http.StatusOK, project)
}

func ShowProject(w http.ResponseWriter, r *http.Request) (int, error) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		return http.StatusBadRequest, err
	}

	project, err := store.GetProject(id)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return writeJSON(w, http.StatusOK, project)
}

func DeleteProject(w http.ResponseWriter, r *http.Request) (int, error) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		return http.StatusBadRequest, err
	}

	resultID, err := store.DeleteProject(id)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return writeJSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("deleted project with id %d and all related documents", resultID),
	})
}
