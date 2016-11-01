package api

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/errors"
)

func tokenGate(next http.Handler) http.Handler {
	return apiHandlerFunc(func(w http.ResponseWriter, r *http.Request) error {
		tokenString, err := getTokenString(r)
		if err != nil {
			return errors.ErrUnauthorized
		}

		claims, err := auth.ParseToken(tokenString, signingKey)
		if err != nil {
			return errors.ErrUnauthorized
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, "userID", claims["sub"])
		ctx = context.WithValue(ctx, "role", claims["role"])

		next.ServeHTTP(w, r.WithContext(ctx))

		return nil
	})
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

func onlyAdmin(next http.Handler) http.Handler {
	return apiHandlerFunc(func(w http.ResponseWriter, r *http.Request) error {
		ctx := r.Context()
		if ctx.Value("role") != "admin" {
			return errors.ErrUnauthorized
		}
		return nil
	})
}
