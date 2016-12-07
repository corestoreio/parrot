package api

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"

	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	"github.com/pressly/chi"
)

var (
	clientSecretBytes = 32
)

func getProjectClients(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}

	result, err := store.GetProjectClients(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

func getProjectClient(w http.ResponseWriter, r *http.Request) {
	clientID := chi.URLParam(r, "clientID")
	if clientID == "" {
		handleError(w, ErrBadRequest)
		return
	}
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}

	result, err := store.GetProjectClient(projectID, clientID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

func deleteProjectClient(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}
	clientID := chi.URLParam(r, "clientID")
	if clientID == "" {
		handleError(w, ErrBadRequest)
		return
	}

	err := store.DeleteProjectClient(projectID, clientID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusNoContent, nil)
}

func createProjectClient(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}

	pc := model.ProjectClient{}
	errs := decodeAndValidate(r.Body, &pc)
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}
	secret, err := generateClientSecret(clientSecretBytes)
	if err != nil {
		handleError(w, ErrInternal)
		return
	}
	pc.Secret = secret
	pc.ProjectID = projectID

	result, err := store.CreateProjectClient(pc)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusCreated, result)
}

func updateProjectClientName(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}
	clientID := chi.URLParam(r, "clientID")
	if clientID == "" {
		handleError(w, ErrBadRequest)
		return
	}

	pc := model.ProjectClient{}
	errs := decodeAndValidate(r.Body, &pc)
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}
	pc.ProjectID = projectID
	pc.ClientID = clientID

	result, err := store.UpdateProjectClientName(pc)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

func resetProjectClientSecret(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}
	clientID := chi.URLParam(r, "clientID")
	if clientID == "" {
		handleError(w, ErrBadRequest)
		return
	}
	secret, err := generateClientSecret(clientSecretBytes)
	if err != nil {
		handleError(w, ErrInternal)
		return
	}

	pc := model.ProjectClient{
		ClientID:  clientID,
		ProjectID: projectID,
		Secret:    secret}

	result, err := store.UpdateProjectClientSecret(pc)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

func generateClientSecret(bytes int) (string, error) {
	b := make([]byte, bytes)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}
