package api

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	"github.com/pressly/chi"
	"golang.org/x/crypto/bcrypt"
)

func createUser(w http.ResponseWriter, r *http.Request) error {
	// TODO(anthonynsimon): handle user already exists
	user := model.User{}
	errs := decodeAndValidate(r.Body, &user)
	if errs != nil {
		render.JSON(w, http.StatusBadRequest, map[string]interface{}{
			"errors": errs,
		})
		return nil
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(hashed)

	err = store.CreateUser(&user)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("created user with email: %s", user.Email),
	})
	return nil
}

func updateUser(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "userID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	user := model.User{}
	errs := decodeAndValidate(r.Body, &user)
	if errs != nil {
		render.JSON(w, http.StatusBadRequest, map[string]interface{}{
			"errors": errs,
		})
		return nil
	}
	user.ID = id

	err = store.UpdateUser(&user)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, user)
	return nil
}

func showUser(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "userID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	user, err := store.GetUser(id)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, user)
	return nil
}

func deleteUser(w http.ResponseWriter, r *http.Request) error {
	id, err := strconv.Atoi(chi.URLParam(r, "userID"))
	if err != nil {
		return errors.ErrBadRequest
	}

	resultID, err := store.DeleteUser(id)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("deleted user with id %d", resultID),
	})
	return nil
}

func getUserIDFromContext(ctx context.Context) (int, error) {
	v := ctx.Value("userID")
	if v == nil {
		return -1, errors.ErrInternal
	}
	str := v.(string)
	if v == "" {
		return -1, errors.ErrInternal
	}
	id, err := strconv.Atoi(str)
	if err != nil {
		return -1, errors.ErrInternal
	}
	return id, nil
}

func decodeAndValidate(r io.Reader, m model.Validatable) []string {
	if err := json.NewDecoder(r).Decode(m); err != nil {
		return []string{"malformed json"}
	}
	errs := m.Validate()
	if errs != nil {
		var errStrings []string
		for _, err := range errs {
			errStrings = append(errStrings, err.Error())
		}
		return errStrings
	}
	return nil
}
