package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	jwt "github.com/dgrijalva/jwt-go"
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

	// TODO validate user credentials and get id and role
	user.ID = 99974251514
	user.Role = "admin"

	// Create the Claims
	claims := tokenClaims{
		user.Role,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
			Subject:   fmt.Sprintf("%d", user.ID),
		},
	}

	tokenString, err := auth.CreateToken(claims)
	if err != nil {
		return err
	}

	render.JSON(w, http.StatusOK, map[string]string{
		"token": tokenString,
	})

	return nil
}
