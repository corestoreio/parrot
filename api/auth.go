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

func tokenMiddleware(ap auth.Provider) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString, err := getTokenString(r)
			if err != nil {
				replyUnauthorized(w)
				return
			}
			claims, err := ap.ParseAndVerifyToken(tokenString)
			if err != nil {
				replyUnauthorized(w)
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

func authenticate(authProvider auth.Provider) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			render.JSONError(w, errors.ErrBadRequest)
			return
		}

		email := r.Form.Get("email")
		password := r.Form.Get("password")

		if email == "" || password == "" {
			render.JSONError(w, errors.ErrBadRequest)
			return
		}

		claimedUser, err := store.GetUserByEmail(email)
		if err != nil {
			render.JSONError(w, errors.ErrNotFound)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(claimedUser.Password), []byte(password)); err != nil {
			render.JSONError(w, errors.ErrUnauthorized)
			return
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
			render.JSONError(w, errors.ErrInternal)
			return
		}

		data := map[string]string{
			"token":      tokenString,
			"token_type": "bearer",
			"expires_in": fmt.Sprintf("%d", claims.ExpiresAt-time.Now().Unix()),
		}

		authResponse(w, http.StatusOK, data)
	}
}

func replyUnauthorized(w http.ResponseWriter) {
	data := map[string]interface{}{
		"status": http.StatusUnauthorized,
		"error":  "unauthorized request",
	}

	authResponse(w, http.StatusUnauthorized, data)
}

func authResponse(w http.ResponseWriter, status int, data interface{}) {
	h := w.Header()
	h.Set("Content-Type", "application/json; charset=utf-8")
	h.Set("Cache-Control", "no-store")
	h.Set("Pragma", "no-cache")
	w.WriteHeader(status)

	encoded, err := json.Marshal(data)
	if err != nil {
		http.Error(w, errors.ErrInternal.Message, errors.ErrInternal.Status)
	}

	w.Write(encoded)
}
