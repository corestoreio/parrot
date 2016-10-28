package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/pressly/chi"
	"golang.org/x/crypto/bcrypt"
)

type tokenClaims struct {
	Role string `json:"role"`
	jwt.StandardClaims
}

func authenticate(w http.ResponseWriter, r *http.Request) error {
	user := model.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		return errors.ErrBadRequest
	}

	if user.Email == "" || user.Password == "" {
		return errors.ErrBadRequest
	}

	claimedUser, err := store.GetUserByEmail(user.Email)
	if err != nil {
		return errors.ErrNotFound
	}

	if err := bcrypt.CompareHashAndPassword([]byte(claimedUser.Password), []byte(user.Password)); err != nil {
		return errors.ErrUnauthorized
	}

	// Create the Claims
	claims := tokenClaims{
		claimedUser.Role,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
			Subject:   fmt.Sprintf("%d", claimedUser.ID),
		},
	}

	tokenString, err := auth.CreateToken(claims, signingKey)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, map[string]string{
		"token": tokenString,
	})

	return nil
}

func createUser(w http.ResponseWriter, r *http.Request) error {
	// TODO(anthonynsimon): handle user already exists
	user := &model.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		return errors.ErrBadRequest
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(hashed)
	user.Role = "admin"

	err = store.CreateUser(user)
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

	user := &model.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		return errors.ErrBadRequest
	}
	user.ID = id

	err = store.UpdateUser(user)
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
