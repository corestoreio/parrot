package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/anthonynsimon/parrot/auth"
	jwt "github.com/dgrijalva/jwt-go"
)

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
				handleError(w, ErrUnauthorized)
				return
			}

			body := map[string]string{
				"token": tokenString,
			}

			bt, err := json.Marshal(body)
			if err != nil {
				handleError(w, ErrInternal)
				return
			}
			response, err := http.Post("http://auth:8080/auth/introspect", "application/json", bytes.NewBuffer(bt))
			if err != nil {
				fmt.Println(err)
				handleError(w, ErrUnauthorized)
				return
			}

			var claims jwt.StandardClaims
			json.NewDecoder(response.Body).Decode(&claims)
			if err != nil {
				handleError(w, ErrInternal)
				return
			}

			sub := claims.Subject

			ctx := r.Context()
			ctx = context.WithValue(ctx, "userID", sub)
			newR := r.WithContext(ctx)

			next.ServeHTTP(w, newR)
		})
	}
}
