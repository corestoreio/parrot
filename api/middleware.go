package api

import (
	"context"
	"fmt"
	"net/http"

	"github.com/anthonynsimon/parrot/api/auth"
	"github.com/anthonynsimon/parrot/render"
	jwt "github.com/dgrijalva/jwt-go"
)

func tokenGate(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	if r.RequestURI == "/api/authenticate" {
		next(w, r)
		return
	}

	tokenString, err := getTokenString(r)
	if err != nil {
		render.JSONError(w, http.StatusUnauthorized)
		return
	}

	claims, err := auth.ParseToken(tokenString)
	if err != nil {
		render.JSONError(w, http.StatusUnauthorized)
		return
	}

	ctx := contextWithClaims(r.Context(), claims)
	next(w, r.WithContext(ctx))
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
