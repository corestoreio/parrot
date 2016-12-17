package auth

import (
	"fmt"
	"net/http"
	"time"

	"github.com/anthonynsimon/parrot/parrot-api/datastore"
	apiErrors "github.com/anthonynsimon/parrot/parrot-api/errors"
	"github.com/anthonynsimon/parrot/parrot-api/render"
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
	SubjectType string `json:"subType"`
	jwt.StandardClaims
}

func IssueToken(tp TokenProvider, store AuthStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			render.Error(w, apiErrors.ErrUnprocessable.Status, apiErrors.ErrUnprocessable)
			return
		}
		payload := new(AuthRequestPayload)
		decoder := schema.NewDecoder()

		err = decoder.Decode(payload, r.Form)
		if err != nil {
			render.Error(w, apiErrors.ErrUnprocessable.Status, apiErrors.ErrUnprocessable)
			return
		}

		switch payload.GrantType {
		case "password":
			handlePasswordGrant(w, *payload, tp, store)
		case "client_credentials":
			handleClientCredentialsGrant(w, *payload, tp, store)
		default:
			render.Error(w, apiErrors.ErrBadRequest.Status, apiErrors.ErrBadRequest)
			return
		}
	}
}

func handlePasswordGrant(w http.ResponseWriter, payload AuthRequestPayload, tp TokenProvider, store AuthStore) {
	if payload.Username == "" || payload.Password == "" {
		render.Error(w, apiErrors.ErrUnprocessable.Status, apiErrors.ErrUnprocessable)
		return
	}

	claimedUser, err := store.GetUserByEmail(payload.Username)
	if err != nil {
		render.Error(w, apiErrors.ErrUnauthorized.Status, apiErrors.ErrUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(claimedUser.Password), []byte(payload.Password)); err != nil {
		render.Error(w, apiErrors.ErrUnauthorized.Status, apiErrors.ErrUnauthorized)
		return
	}

	// Create the Claims
	now := time.Now()
	claims := tokenClaims{
		SubjectType: "user",
		StandardClaims: jwt.StandardClaims{
			Issuer:    tp.Name,
			IssuedAt:  now.Unix(),
			ExpiresAt: now.Add(time.Hour * 24).Unix(),
			Subject:   fmt.Sprintf("%s", claimedUser.ID),
		},
	}

	tokenString, err := tp.CreateToken(claims)
	if err != nil {
		render.Error(w, apiErrors.ErrUnprocessable.Status, apiErrors.ErrUnprocessable)
		return
	}

	data := TokenResponse{
		AccessToken: tokenString,
		TokenType:   "Bearer",
		ExpiresIn:   fmt.Sprintf("%d", claims.ExpiresAt-time.Now().Unix()),
	}

	RenderJSON(w, http.StatusOK, TokenResponseHeaders, data)
}

func handleClientCredentialsGrant(w http.ResponseWriter, payload AuthRequestPayload, tp TokenProvider, store AuthStore) {
	if payload.ClientId == "" || payload.ClientSecret == "" {
		render.Error(w, apiErrors.ErrUnprocessable.Status, apiErrors.ErrUnprocessable)
		return
	}

	claimedClient, err := store.FindOneClient(payload.ClientId)
	if err != nil {
		render.Error(w, apiErrors.ErrUnauthorized.Status, apiErrors.ErrUnauthorized)
		return
	}

	// Can't use bcrypt, client secret must be visible in web app. Can be regenerated at any time.
	if claimedClient.Secret != payload.ClientSecret {
		render.Error(w, apiErrors.ErrUnauthorized.Status, apiErrors.ErrUnauthorized)
		return
	}

	// Create the Claims
	now := time.Now()
	claims := tokenClaims{
		SubjectType: "client",
		StandardClaims: jwt.StandardClaims{
			Issuer:    tp.Name,
			IssuedAt:  now.Unix(),
			ExpiresAt: now.Add(time.Hour * 24).Unix(),
			Subject:   fmt.Sprintf("%s", claimedClient.ClientID),
		},
	}

	tokenString, err := tp.CreateToken(claims)
	if err != nil {
		render.Error(w, apiErrors.ErrUnprocessable.Status, apiErrors.ErrUnprocessable)
		return
	}

	data := TokenResponse{
		AccessToken: tokenString,
		TokenType:   "Bearer",
		ExpiresIn:   fmt.Sprintf("%d", claims.ExpiresAt-time.Now().Unix()),
	}

	RenderJSON(w, http.StatusOK, TokenResponseHeaders, data)
}

func IntrospectToken(tp TokenProvider, store datastore.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			render.Error(w, apiErrors.ErrUnprocessable.Status, apiErrors.ErrUnprocessable)
			return
		}
		payload := new(IntrospectRequest)
		decoder := schema.NewDecoder()

		err = decoder.Decode(payload, r.Form)
		if err != nil {
			render.Error(w, apiErrors.ErrUnprocessable.Status, apiErrors.ErrUnprocessable)
			return
		}

		if payload.Token == "" {
			render.Error(w, apiErrors.ErrBadRequest.Status, apiErrors.ErrBadRequest)
			return
		}

		claims, err := tp.ParseAndExtractClaims(payload.Token)
		if err != nil {
			render.Error(w, apiErrors.ErrUnprocessable.Status, apiErrors.ErrUnprocessable)
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
