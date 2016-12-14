package api

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/anthonynsimon/parrot/parrot-api/auth"
)

func tokenMiddleware(tp auth.TokenProvider) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString, err := getTokenString(r)
			if err != nil {
				handleError(w, ErrUnauthorized)
				return
			}

			claims, err := tp.ParseAndVerifyToken(tokenString)
			if err != nil {
				handleError(w, ErrUnauthorized)
				return
			}

			sub := claims["sub"]
			if sub == "" {
				handleError(w, ErrInternal)
				return
			}

			ctx := r.Context()
			ctx = context.WithValue(ctx, "userID", sub)
			newR := r.WithContext(ctx)

			next.ServeHTTP(w, newR)
		})
	}
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
