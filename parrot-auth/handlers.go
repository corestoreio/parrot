package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/anthonynsimon/parrot/common/datastore"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/schema"
	"golang.org/x/crypto/bcrypt"
)

type AuthRequestPayload struct {
	ClientId     string `json:"client_id" schema:"client_id"`
	ClientSecret string `json:"client_secret" schema:"client_secret"`
	GrantType    string `json:"grant_type" schema:"grant_type"`
	Username     string `json:"username" schema:"username"`
	Password     string `json:"password" schema:"password"`
}

type IntrospectRequest struct {
	Token         string `json:"token" schema:"token"`
	TokenTypeHint string `json:"token_type_hint" schema:"token_type_hint"`
	ClientId      string `json:"client_id" schema:"client_id"`
	ClientSecret  string `json:"client_secret" schema:"client_secret"`
}

type TokenResponse struct {
	AccessToken string `json:"access_token" `
	TokenType   string `json:"token_type" `
	ExpiresIn   string `json:"expires_in" `
}

var (
	TokenResponseHeaders = map[string]string{
		"Cache-Control": "no-store",
		"Pragma":        "no-cache",
	}
)

type tokenClaims struct {
	jwt.StandardClaims
}

func issueToken(tp TokenProvider, store AuthStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnprocessableEntity), http.StatusUnprocessableEntity)
			return
		}
		payload := new(AuthRequestPayload)
		decoder := schema.NewDecoder()

		err = decoder.Decode(payload, r.Form)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnprocessableEntity), http.StatusUnprocessableEntity)
			return
		}

		switch payload.GrantType {
		case "password":
			handlePasswordAuth(w, *payload, tp, store)
		default:
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}
	}
}

func handlePasswordAuth(w http.ResponseWriter, payload AuthRequestPayload, tp TokenProvider, store AuthStore) {
	if payload.Username == "" || payload.Password == "" {
		http.Error(w, http.StatusText(http.StatusUnprocessableEntity), http.StatusUnprocessableEntity)
		return
	}

	claimedUser, err := store.GetUserByEmail(payload.Username)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(claimedUser.Password), []byte(payload.Password)); err != nil {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	// Create the Claims
	now := time.Now()
	claims := tokenClaims{
		jwt.StandardClaims{
			Issuer:    tp.Name,
			IssuedAt:  now.Unix(),
			ExpiresAt: now.Add(time.Hour * 24).Unix(),
			Subject:   fmt.Sprintf("%s", claimedUser.ID),
		},
	}

	tokenString, err := tp.CreateToken(claims)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusUnprocessableEntity), http.StatusInternalServerError)
		return
	}

	data := TokenResponse{
		AccessToken: tokenString,
		TokenType:   "Bearer",
		ExpiresIn:   fmt.Sprintf("%d", claims.ExpiresAt-time.Now().Unix()),
	}

	RenderJSON(w, http.StatusOK, TokenResponseHeaders, data)
}

func instrospectToken(tp TokenProvider, store datastore.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnprocessableEntity), http.StatusUnprocessableEntity)
			return
		}
		payload := new(IntrospectRequest)
		decoder := schema.NewDecoder()

		err = decoder.Decode(payload, r.Form)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnprocessableEntity), http.StatusUnprocessableEntity)
			return
		}

		if payload.Token == "" {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		claims, err := tp.ParseAndExtractClaims(payload.Token)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		data := make(map[string]interface{})

		for k, v := range claims {
			data[k] = v
		}

		data["active"] = true
		if err := claims.Valid(); err != nil {
			data["active"] = false
		}

		RenderJSON(w, http.StatusOK, nil, data)
	}
}
