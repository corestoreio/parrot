package api

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	"golang.org/x/crypto/bcrypt"
)

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
		handleError(w, ErrInternal)
		return
	}

	user.Password = string(hashed)

	err = store.CreateUser(&user)
	if err != nil {
		handleError(w, err)
		return
	}

	render.JSON(w, http.StatusCreated, map[string]interface{}{
		"message": fmt.Sprintf("created user with email: %s", user.Email),
	})
}

func getUserIDFromContext(ctx context.Context) (int, error) {
	v := ctx.Value("userID")
	if v == nil {
		return -1, ErrInternal
	}
	str := v.(string)
	if v == "" {
		return -1, ErrInternal
	}
	id, err := strconv.Atoi(str)
	if err != nil {
		return -1, ErrInternal
	}
	return id, nil
}

func decodeAndValidate(r io.Reader, m model.Validatable) error {
	if err := json.NewDecoder(r).Decode(m); err != nil {
		return ErrBadRequest
	}
	return m.Validate()
}
