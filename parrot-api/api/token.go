package api

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/anthonynsimon/parrot/parrot-api/auth"
	apiErrors "github.com/anthonynsimon/parrot/parrot-api/errors"
)

type Subject string

const (
	UserSubject   = "user"
	ClientSubject = "client"
)

func tokenMiddleware(tp auth.TokenProvider) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString, err := getTokenString(r)
			if err != nil {
				handleError(w, apiErrors.ErrUnauthorized)
				return
			}

			claims, err := tp.ParseAndVerifyToken(tokenString)
			if err != nil {
				handleError(w, apiErrors.ErrUnauthorized)
				return
			}

			subID := claims["sub"]
			if subID == nil || subID == "" {
				handleError(w, apiErrors.ErrInternal)
				return
			}

			subType := claims["subType"]
			if subType == nil || subType == "" {
				handleError(w, apiErrors.ErrInternal)
				return
			}

			ctx := r.Context()
			ctx = context.WithValue(ctx, "subjectID", subID)
			ctx = context.WithValue(ctx, "subjectType", subType)
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

func getSubjectID(ctx context.Context) (string, error) {
	v := ctx.Value("subjectID")
	if v == nil {
		return "", apiErrors.ErrBadRequest
	}
	id, ok := v.(string)
	if id == "" || !ok {
		return "", apiErrors.ErrInternal
	}
	return id, nil
}

func getSubjectType(ctx context.Context) (Subject, error) {
	subType := ctx.Value("subjectType")
	if subType == nil {
		return "", apiErrors.ErrBadRequest
	}

	casted, ok := subType.(string)
	if !ok || casted == "" {
		return "", apiErrors.ErrBadRequest
	}

	return Subject(casted), nil
}
