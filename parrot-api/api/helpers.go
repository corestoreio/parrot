package api

import (
	"context"
	"net/http"

	"github.com/anthonynsimon/parrot/common/render"
)

var (
	validContentTypes = []string{
		"application/json",
		"application/json; charset=utf-8"}
)

func isValidContentType(ct string) bool {
	if ct == "" {
		return false
	}
	for _, v := range validContentTypes {
		if ct == v {
			return true
		}
	}
	return false
}

func ping(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Parrot says hello.",
	})
}

func getScopes(ctx context.Context) ([]string, error) {
	v := ctx.Value("scopes")
	if v == nil {
		return nil, ErrBadRequest
	}
	scopes, ok := v.([]string)
	if !ok {
		return nil, ErrInternal
	}
	return scopes, nil
}
