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

func createDocument(w http.ResponseWriter, r *http.Request) error {
	projID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	doc := &model.Document{}
	if err := json.NewDecoder(r.Body).Decode(&doc); err != nil {
		return errors.ErrBadRequest
	}

	doc.ProjectID = projID

	proj, err := store.GetProject(projID)
	if err != nil {
		return err
	}

	doc.SyncKeys(proj.Keys)

	err = store.CreateDoc(doc)
	if err != nil {
		return errors.ErrInternal
	}

	render.JSON(w, http.StatusCreated, doc)
	return nil
}

func showDocument(w http.ResponseWriter, r *http.Request) error {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest
	}
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		return errors.ErrBadRequest
	}

	doc, err := store.GetProjectDoc(projectID, id)
	if err != nil {
		return err
	}

	proj, err := store.GetProject(projectID)
	if err != nil {
		return err
	}

	doc.SyncKeys(proj.Keys)

	render.JSON(w, http.StatusOK, doc)
	return nil
}

func findDocuments(w http.ResponseWriter, r *http.Request) error {
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest

	}
	locales := r.URL.Query()["locale"]

	docs, err := store.FindProjectDocs(projectID, locales...)
	if err != nil {
		return err
	}

	project, err := store.GetProject(projectID)
	if err != nil {
		return err
	}

	for i := range docs {
		docs[i].SyncKeys(project.Keys)
	}

	render.JSON(w, http.StatusOK, docs)
	return nil
}

func updateDocument(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		return errors.ErrBadRequest
	}
	projectID, err := strconv.Atoi(chi.URLParam(r, "projectID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	doc := &model.Document{}
	if err := json.NewDecoder(r.Body).Decode(&doc); err != nil {
		return errors.ErrBadRequest
	}
	doc.ID = id

	project, err := store.GetProject(projectID)
	if err != nil {
		return err
	}

	doc.SyncKeys(project.Keys)

	err = store.UpdateDoc(doc)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, doc)
	return nil
}

func deleteDocument(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		return errors.ErrBadRequest
	}

	resultID, err := store.DeleteDoc(id)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("deleted document with id %d", resultID),
	})
	return nil
}
