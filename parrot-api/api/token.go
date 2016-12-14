package api

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/anthonynsimon/parrot/parrot-api/auth"
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
				handleError(w, ErrUnauthorized)
				return
			}

			claims, err := tp.ParseAndVerifyToken(tokenString)
			if err != nil {
				handleError(w, ErrUnauthorized)
				return
			}

			subID := claims["sub"]
			if subID == nil || subID == "" {
				handleError(w, ErrInternal)
				return
			}

			subType := claims["subType"]
			if subType == nil || subType == "" {
				handleError(w, ErrInternal)
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
		return "", ErrBadRequest
	}
	id, ok := v.(string)
	if id == "" || !ok {
		return "", ErrInternal
	}
	return id, nil
}

func getSubjectType(ctx context.Context) (Subject, error) {
	subType := ctx.Value("subjectType")
	if subType == nil {
		fmt.Println(subType, "HERE 1")
		return "", ErrBadRequest
	}
	fmt.Println(subType)

	casted, ok := subType.(string)
	if !ok || casted == "" {
		fmt.Println(casted, "HERE 2")
		return "", ErrBadRequest
	}

	return Subject(casted), nil
}
