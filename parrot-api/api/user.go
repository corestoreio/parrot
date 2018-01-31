package api

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	apiErrors "github.com/parrot-translate/parrot/parrot-api/errors"
	"github.com/parrot-translate/parrot/parrot-api/model"
	"github.com/parrot-translate/parrot/parrot-api/render"
	"golang.org/x/crypto/bcrypt"
)

type userSelfPayload struct {
	*model.User
	ProjectRoles  projectRoles  `json:"projectRoles,omitempty"`
	ProjectGrants projectGrants `json:"projectGrants,omitempty"`
}

type projectGrants map[string][]RoleGrant

type projectRoles map[string]string

// getUserSelf is an API endpoint for getting the requesting user's details.
func getUserSelf(w http.ResponseWriter, r *http.Request) {
	id, err := getSubjectID(r.Context())
	if err != nil {
		handleError(w, apiErrors.ErrBadRequest)
		return
	}

	user, err := store.GetUserByID(id)
	if err != nil {
		handleError(w, err)
		return
	}
	// Hide password
	user.Password = ""

	payload := userSelfPayload{user, nil, nil}

	include := r.URL.Query().Get("include")
	if include != "" {
		switch include {
		case "projectRoles":
			projectUsers, err := store.GetUserProjectRoles(user.ID)
			if err != nil {
				handleError(w, err)
				return
			}

			result := make(projectRoles)
			for _, pu := range projectUsers {
				result[pu.ProjectID] = pu.Role
			}

			payload.ProjectRoles = result

		case "projectGrants":
			projectUsers, err := store.GetUserProjectRoles(user.ID)
			if err != nil {
				handleError(w, err)
				return
			}

			grants := make(projectGrants)
			for _, pu := range projectUsers {
				role := Role(pu.Role)
				grants[pu.ProjectID] = permissions[role]
			}
			payload.ProjectGrants = grants
		}
	}

	render.JSON(w, http.StatusOK, payload)
}

// createUser is an API endpoint for registering new users.
func createUser(w http.ResponseWriter, r *http.Request) {
	user := model.User{}
	errs := decodeAndValidate(r.Body, &user)
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}

	existingUser, err := store.GetUserByEmail(user.Email)
	if err == nil && existingUser.Email == user.Email {
		handleError(w, apiErrors.ErrAlreadyExists)
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		handleError(w, err)
		return
	}

	user.Password = string(hashed)

	result, err := store.CreateUser(user)
	if err != nil {
		handleError(w, err)
		return
	}

	// Hide password
	result.Password = ""
	render.JSON(w, http.StatusCreated, result)
}

// updateUserPassword is an API endpoint for changing a user's password.
func updateUserPassword(w http.ResponseWriter, r *http.Request) {
	payload := updatePasswordPayload{}
	err := decodePayloadAndValidate(r, &payload)
	if err != nil {
		handleError(w, apiErrors.ErrUnprocessable)
		return
	}

	// Validate requesting user matches requested user to be updated
	err = mustMatchContextUser(r, payload.UserID)
	if err != nil {
		handleError(w, apiErrors.ErrForbiden)
		return
	}

	claimedUser, err := store.GetUserByID(payload.UserID)
	if err != nil {
		handleError(w, err)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(claimedUser.Password), []byte(payload.OldPassword)); err != nil {
		handleError(w, apiErrors.ErrForbiden)
		return
	}

	claimedUser.Password = payload.NewPassword
	errs := claimedUser.Validate()
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}

	newPasswordHash, err := bcrypt.GenerateFromPassword([]byte(claimedUser.Password), bcrypt.DefaultCost)
	if err != nil {
		handleError(w, err)
		return
	}

	claimedUser.Password = string(newPasswordHash)

	result, err := store.UpdateUserPassword(*claimedUser)
	if err != nil {
		handleError(w, err)
		return
	}

	// Hide password
	result.Password = ""
	render.JSON(w, http.StatusOK, result)
}

// updateUserName is an API endpoint for changing a user's name.
func updateUserName(w http.ResponseWriter, r *http.Request) {
	payload := updateUserNamePayload{}
	err := decodePayloadAndValidate(r, &payload)
	if err != nil {
		handleError(w, apiErrors.ErrUnprocessable)
		return
	}

	err = mustMatchContextUser(r, payload.UserID)
	if err != nil {
		handleError(w, apiErrors.ErrForbiden)
		return
	}

	claimedUser, err := store.GetUserByID(payload.UserID)
	if err != nil {
		handleError(w, err)
		return
	}

	claimedUser.Name = payload.Name
	errs := claimedUser.Validate()
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}

	result, err := store.UpdateUserName(*claimedUser)
	if err != nil {
		handleError(w, err)
		return
	}

	// Hide password
	result.Password = ""
	render.JSON(w, http.StatusOK, result)
}

// updateUserEmail is an API endpoint for changing a user's email.
func updateUserEmail(w http.ResponseWriter, r *http.Request) {
	payload := updateUserEmailPayload{}
	err := decodePayloadAndValidate(r, &payload)
	if err != nil {
		handleError(w, apiErrors.ErrUnprocessable)
		return
	}

	err = mustMatchContextUser(r, payload.UserID)
	if err != nil {
		handleError(w, apiErrors.ErrForbiden)
		return
	}

	claimedUser, err := store.GetUserByID(payload.UserID)
	if err != nil {
		handleError(w, err)
		return
	}

	claimedUser.Email = payload.Email
	errs := claimedUser.Validate()
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}

	result, err := store.UpdateUserEmail(*claimedUser)
	if err != nil {
		handleError(w, err)
		return
	}

	// Hide password
	result.Password = ""
	render.JSON(w, http.StatusOK, result)
}

// decodeAndValidate decodes a model that implements the Validatable interface
// and calls the Validate function on it, returning any errros if something went wrong.
func decodeAndValidate(r io.Reader, m model.Validatable) error {
	if err := json.NewDecoder(r).Decode(m); err != nil {
		return apiErrors.ErrBadRequest
	}
	return m.Validate()
}

// mustMatchContextUser returns an error if the provided userID does not match
// the userID placed in the request context.
func mustMatchContextUser(r *http.Request, userID string) error {
	id, err := getSubjectID(r.Context())
	if err != nil {
		return err
	}

	// Validate requesting user is the user being updated
	if userID != id {
		return errors.New("context user does not match request user id")
	}

	return nil
}
