package main

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/anthonynsimon/parrot/common/model"
	"github.com/anthonynsimon/parrot/common/render"
	"golang.org/x/crypto/bcrypt"
)

type updatePasswordPayload struct {
	UserID      string `json:"userId`
	OldPassword string `json:"oldPassword"`
	NewPassword string `json:"newPassword`
}

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
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		handleError(w, ErrUnprocessable)
		return
	}

	if payload.NewPassword == "" || payload.OldPassword == "" || payload.UserID == "" {
		handleError(w, ErrBadRequest)
		return
	}

	userID, err := getUserID(r.Context())
	if err != nil {
		handleError(w, ErrBadRequest)
		return
	}

	// Validate requesting user matches requested user to be updated
	if payload.UserID != userID {
		handleError(w, ErrForbiden)
		return
	}

	claimedUser, err := store.GetUserByID(userID)
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
	render.JSON(w, http.StatusCreated, result)
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
