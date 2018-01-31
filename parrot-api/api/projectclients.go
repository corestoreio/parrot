package api

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"

	apiErrors "github.com/parrot-translate/parrot/parrot-api/errors"
	"github.com/parrot-translate/parrot/parrot-api/model"
	"github.com/parrot-translate/parrot/parrot-api/render"
	"github.com/pressly/chi"
)

var (
	clientSecretBytes = 32
)

// getProjectClients is an API endpoint for retrieving all clients ('applications') for a project.
func getProjectClients(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	result, err := store.GetProjectClients(projectID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

// getProjectClient is an API endpoint for retrieving a project client.
func getProjectClient(w http.ResponseWriter, r *http.Request) {
	clientID := chi.URLParam(r, "clientID")
	if clientID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	result, err := store.GetProjectClient(projectID, clientID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusOK, result)
}

// deleteProjectClient is an API endpoint for deleting a project client.
func deleteProjectClient(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	clientID := chi.URLParam(r, "clientID")
	if clientID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	err := store.DeleteProjectClient(projectID, clientID)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusNoContent, nil)
}

// createProjectClient is an API endpoint for registering a new project client.
func createProjectClient(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
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
		handleError(w, apiErrors.ErrInternal)
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

// updateProjectClientName is an API endpoint for updating a project client's name.
func updateProjectClientName(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	clientID := chi.URLParam(r, "clientID")
	if clientID == "" {
		handleError(w, apiErrors.ErrBadRequest)
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

// resetProjectClientSecret is an API endpoint for regenerating a project client's secret.
func resetProjectClientSecret(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	clientID := chi.URLParam(r, "clientID")
	if clientID == "" {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}
	secret, err := generateClientSecret(clientSecretBytes)
	if err != nil {
		handleError(w, apiErrors.ErrInternal)
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

// generateClientSecret generates a cryptographically secure pseudorandom string.
func generateClientSecret(bytes int) (string, error) {
	b := make([]byte, bytes)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}
