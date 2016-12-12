package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func getAuthHeaderToken(r *http.Request) (string, error) {
	token := r.Header.Get("Authorization")
	if token == "" {
		return "", fmt.Errorf("no auth header")
	}

	token = sanitizeBearerToken(token)

	return token, nil
}
func getJSONBodyToken(r *http.Request) (string, error) {
	var body map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		return "", err
	}
	token, ok := body["token"].(string)
	if token == "" || !ok {
		return "", fmt.Errorf("no auth header")
	}

	token = sanitizeBearerToken(token)

	return token, nil
}

func sanitizeBearerToken(token string) string {
	if len(token) > 6 && strings.ToUpper(token[0:7]) == "BEARER " {
		return token[7:]
	}
	return token
}
