package main

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/anthonynsimon/parrot/common/model"
	"github.com/anthonynsimon/parrot/common/render"
	"golang.org/x/crypto/bcrypt"
)

func getUserSelf(w http.ResponseWriter, r *http.Request) {
	id, err := getUserID(r.Context())
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}

	user, err := store.GetUserByID(id)
	if err != nil {
		handleError(w, err)
		return
	}

	// Hide password
	user.Password = ""
	render.JSON(w, http.StatusOK, user)
}

func createUser(w http.ResponseWriter, r *http.Request) {
	user := model.User{}
	errs := decodeAndValidate(r.Body, &user)
	if errs != nil {
		render.Error(w, http.StatusUnprocessableEntity, errs)
		return
	}

	existingUser, err := store.GetUserByEmail(user.Email)
	if err == nil && existingUser.Email == user.Email {
		handleError(w, ErrAlreadyExists)
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

func updateUserPassword(w http.ResponseWriter, r *http.Request) {
	payload := updatePasswordPayload{}
	err := decodePayloadAndValidate(r, &payload)
	if err != nil {
		handleError(w, ErrUnprocessable)
		return
	}

	// Validate requesting user matches requested user to be updated
	err = mustMatchContextUser(r, payload.UserID)
	if err != nil {
		handleError(w, ErrForbiden)
		return
	}

	claimedUser, err := store.GetUserByID(payload.UserID)
	if err != nil {
		handleError(w, err)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(claimedUser.Password), []byte(payload.OldPassword)); err != nil {
		handleError(w, ErrForbiden)
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

func updateUserName(w http.ResponseWriter, r *http.Request) {
	payload := updateUserNamePayload{}
	err := decodePayloadAndValidate(r, &payload)
	if err != nil {
		handleError(w, ErrUnprocessable)
		return
	}

	err = mustMatchContextUser(r, payload.UserID)
	if err != nil {
		handleError(w, ErrForbiden)
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

func updateUserEmail(w http.ResponseWriter, r *http.Request) {
	payload := updateUserEmailPayload{}
	err := decodePayloadAndValidate(r, &payload)
	if err != nil {
		handleError(w, ErrUnprocessable)
		return
	}

	err = mustMatchContextUser(r, payload.UserID)
	if err != nil {
		handleError(w, ErrForbiden)
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

func getUserID(ctx context.Context) (string, error) {
	v := ctx.Value("userID")
	if v == nil {
		return "", ErrBadRequest
	}
	id, ok := v.(string)
	if id == "" || !ok {
		return "", ErrInternal
	}
	return id, nil
}

func decodeAndValidate(r io.Reader, m model.Validatable) error {
	if err := json.NewDecoder(r).Decode(m); err != nil {
		return ErrBadRequest
	}
	return m.Validate()
}

func mustMatchContextUser(r *http.Request, userID string) error {
	id, err := getUserID(r.Context())
	if err != nil {
		return err
	}

	// Validate requesting user matches requested user to be updated
	if userID != id {
		return errors.New("context user does not match request user id")
	}

	return nil
}
