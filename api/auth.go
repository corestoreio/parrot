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
		err := r.ParseForm()
		if err != nil {
			return errors.ErrBadRequest
		}

		email := r.Form.Get("email")
		password := r.Form.Get("password")

		if email == "" || password == "" {
			return errors.ErrBadRequest
		}

		claimedUser, err := store.GetUserByEmail(email)
		if err != nil {
			return errors.ErrNotFound
		}

		if err := bcrypt.CompareHashAndPassword([]byte(claimedUser.Password), []byte(password)); err != nil {
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

		// Handle response writing here instead of letting render.JSON do it
		// Set no cache headers
		h := w.Header()
		h.Set("Content-Type", "application/json; charset=utf-8")
		h.Set("Cache-Control", "no-store")
		h.Set("Pragma", "no-cache")
		w.WriteHeader(http.StatusOK)

		data := map[string]string{
			"token":      tokenString,
			"token_type": "bearer",
			"expires_in": fmt.Sprintf("%d", claims.ExpiresAt-time.Now().Unix()),
		}

		encoded, err := json.Marshal(data)
		if err != nil {
			http.Error(w, errors.ErrInternal.Message, errors.ErrInternal.Code)
		}

		w.Write(encoded)

		return nil
	}
}
