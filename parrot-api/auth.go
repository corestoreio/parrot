package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
)

func tokenMiddleware(tokenInstrospectionEndpoint string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString, err := getTokenString(r)
			if err != nil {
				handleError(w, ErrUnauthorized)
				return
			}

			data := url.Values{}
			data.Set("token", tokenString)
			data.Set("token_type_hint", "access_token")
			encodedData := data.Encode()

			client := &http.Client{}
			req, err := http.NewRequest("POST", tokenInstrospectionEndpoint, bytes.NewBufferString(encodedData))
			if err != nil {
				handleError(w, ErrInternal)
				return
			}

			req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
			req.Header.Add("Content-Length", strconv.Itoa(len(encodedData)))
			// req.Header.Add("Authorization", "") // TODO: handle app client auth

			response, err := client.Do(req)
			if err != nil {
				handleError(w, ErrInternal)
				return
			}

			if response.StatusCode < 200 || response.StatusCode >= 300 {
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
