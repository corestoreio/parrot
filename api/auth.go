package api

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/anthonynsimon/parrot/auth"
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

func tokenMiddleware(ap auth.Provider) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString, err := getTokenString(r)
			if err != nil {
				handleError(w, ErrUnauthorized)
				return
			}
			claims, err := ap.ParseAndVerifyToken(tokenString)
			if err != nil {
				handleError(w, ErrUnauthorized)
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
		user := model.User{}
		if errs := decodeAndValidate(r.Body, &user); errs != nil {
			render.Error(w, http.StatusUnprocessableEntity, errs)
			return
		}

		if user.Email == "" || user.Password == "" {
			handleError(w, ErrBadRequest)
			return
		}

		claimedUser, err := store.GetUserByEmail(user.Email)
		if err != nil {
			handleError(w, err)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(claimedUser.Password), []byte(user.Password)); err != nil {
			handleError(w, ErrUnauthorized)
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
			handleError(w, ErrInternal)
			return
		}

		data := map[string]string{
			"token":      tokenString,
			"token_type": "bearer",
			"expires_in": fmt.Sprintf("%d", claims.ExpiresAt-time.Now().Unix()),
		}
		headers := map[string]string{
			"Cache-Control": "no-store",
			"Pragma":        "no-cache",
		}

		render.JSONWithHeaders(w, http.StatusOK, headers, data)
	}
}
