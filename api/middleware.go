package api

import (
	"context"
	"fmt"
	"net/http"

	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/errors"
	jwt "github.com/dgrijalva/jwt-go"
)

func tokenGate(next http.Handler) http.Handler {
	return apiHandlerFunc(func(w http.ResponseWriter, r *http.Request) error {
		tokenString, err := getTokenString(r)
		if err != nil {
			return errors.ErrUnauthorized
		}

		claims, err := auth.ParseToken(tokenString)
		if err != nil {
			return errors.ErrUnauthorized
		}

		ctx := contextWithClaims(r.Context(), claims)
		next.ServeHTTP(w, r.WithContext(ctx))
		return nil
	})
}

func getTokenString(r *http.Request) (string, error) {
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		return "", fmt.Errorf("no auth header")
	}
	return tokenString, nil
}

func contextWithClaims(ctx context.Context, claims jwt.MapClaims) context.Context {
	c := context.WithValue(ctx, "userID", claims["sub"])
	c = context.WithValue(c, "role", claims["role"])
	return c
}
