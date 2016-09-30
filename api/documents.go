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

func createDocument(w http.ResponseWriter, r *http.Request) {
	projID, err := strconv.Atoi(mux.Vars(r)["projectID"])
	if err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}

	doc := &model.Document{}
	if err := json.NewDecoder(r.Body).Decode(&doc); err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}

	doc.ProjectID = projID

	proj, err := store.GetProject(projID)
	if err != nil {
		if err == errors.ErrNotFound {
			render.JSONError(w, http.StatusNotFound)
			return
		}
		render.JSONError(w, http.StatusInternalServerError)
		return
	}

	doc.SyncKeys(proj.Keys)

	err = store.CreateDoc(doc)
	if err != nil {
		render.JSONError(w, http.StatusInternalServerError)
		return
	}

	render.JSON(w, http.StatusCreated, doc)
}

func showDocument(w http.ResponseWriter, r *http.Request) {
	projectID, err := strconv.Atoi(mux.Vars(r)["projectID"])
	if err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}

	doc, err := store.GetProjectDoc(projectID, id)
	if err != nil {
		if err == errors.ErrNotFound {
			render.JSONError(w, http.StatusNotFound)
			return
		}
		render.JSONError(w, http.StatusInternalServerError)
		return
	}

	render.JSON(w, http.StatusOK, doc)
}

func findDocuments(w http.ResponseWriter, r *http.Request) {
	projID, err := strconv.Atoi(mux.Vars(r)["projectID"])
	if err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}
	locales := r.URL.Query()["locale"]

	docs, err := store.FindProjectDocs(projID, locales...)
	if err != nil {
		if err == errors.ErrNotFound {
			render.JSONError(w, http.StatusNotFound)
			return
		}
		render.JSONError(w, http.StatusInternalServerError)
		return
	}

	render.JSON(w, http.StatusOK, docs)
}

func updateDocument(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}
	projectID, err := strconv.Atoi(mux.Vars(r)["projectID"])
	if err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}

	doc := &model.Document{}
	if err := json.NewDecoder(r.Body).Decode(&doc); err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}
	doc.ID = id

	project, err := store.GetProject(projectID)
	if err != nil {
		if err == errors.ErrNotFound {
			render.JSONError(w, http.StatusNotFound)
			return
		}
		render.JSONError(w, http.StatusInternalServerError)
		return
	}

	doc.SyncKeys(project.Keys)

	err = store.UpdateDoc(doc)
	if err != nil {
		if err == errors.ErrNotFound {
			render.JSONError(w, http.StatusNotFound)
			return
		}
		render.JSONError(w, http.StatusInternalServerError)
		return
	}

	render.JSON(w, http.StatusOK, doc)
}

func deleteDocument(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		render.JSONError(w, http.StatusBadRequest)
		return
	}

	resultID, err := store.DeleteDoc(id)
	if err != nil {
		if err == errors.ErrNotFound {
			render.JSONError(w, http.StatusNotFound)
			return
		}
		render.JSONError(w, http.StatusInternalServerError)
		return
	}

	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("deleted document with id %d", resultID),
	})
}
