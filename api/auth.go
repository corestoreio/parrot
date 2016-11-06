package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	jwt "github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

type tokenClaims struct {
	jwt.StandardClaims
}

func getTokenString(r *http.Request) (string, error) {
	token := r.Header.Get("Authorization")
	if token == "" {
		return "", fmt.Errorf("no auth header")
	}

	if len(token) > 6 && strings.ToUpper(token[0:7]) == "BEARER " {
		token = token[7:]
	}

	return token, nil
}

func newTokenMiddleware(ap auth.Provider) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString, err := getTokenString(r)
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			claims, err := ap.ParseAndVerifyToken(tokenString)
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			sub := claims["sub"]

			ctx := r.Context()
			ctx = context.WithValue(ctx, "userID", sub)
			newR := r.WithContext(ctx)

			next.ServeHTTP(w, newR)
		})
	}
}

func authenticate(authProvider auth.Provider) func(http.ResponseWriter, *http.Request) error {
	return func(w http.ResponseWriter, r *http.Request) error {
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
		now := time.Now()
		claims := tokenClaims{
			jwt.StandardClaims{
				Issuer:    authProvider.Name,
				IssuedAt:  now.Unix(),
				ExpiresAt: now.Add(time.Hour * 24).Unix(),
				Subject:   fmt.Sprintf("%d", claimedUser.ID),
			},
		}

		tokenString, err := authProvider.CreateToken(claims)
		if err != nil {
			return err
		}

		render.JSON(w, http.StatusOK, map[string]string{
			"token": tokenString,
		})

		return nil
	}
}
