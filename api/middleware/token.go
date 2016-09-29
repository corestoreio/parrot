package middleware

import (
	"context"
	"fmt"
	"net/http"

	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/render"
	jwt "github.com/dgrijalva/jwt-go"
)

func TokenGate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := getTokenString(r)
		if err != nil {
			render.JSONError(w, http.StatusBadRequest)
			return
		}

		claims, err := auth.ParseToken(tokenString)
		if err != nil {
			render.JSONError(w, http.StatusUnauthorized)
			return
		}

		ctx := contextWithClaims(r.Context(), claims)
		next.ServeHTTP(w, r.WithContext(ctx))
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
