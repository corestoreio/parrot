package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/schema"
	"golang.org/x/crypto/bcrypt"
)

type AuthStore interface {
	model.UserStorer
	model.ProjectClientStorer
	Ping() error
	Close() error
}

type AuthRequestPayload struct {
	ClientId     string `json:"client_id" schema:"client_id"`
	ClientSecret string `json:"client_secret" schema:"client_secret"`
	GrantType    string `json:"grant_type" schema:"grant_type"`
	Username     string `json:"username" schema:"username"`
	Password     string `json:"password" schema:"password"`
}

type tokenClaims struct {
	jwt.StandardClaims
}

func authenticate(authProvider auth.Provider, store AuthStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// payload := AuthRequestPayload{}

		err := r.ParseForm()
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnprocessableEntity), http.StatusUnprocessableEntity)
			return
		}
		payload := new(AuthRequestPayload)
		decoder := schema.NewDecoder()

		err = decoder.Decode(payload, r.Form)
		if err != nil {
			fmt.Println(err)
			http.Error(w, http.StatusText(http.StatusUnprocessableEntity), http.StatusUnprocessableEntity)
			return
		}

		// if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		// 	http.Error(w, http.StatusText(http.StatusUnprocessableEntity), http.StatusUnprocessableEntity)
		// 	return

		if payload.GrantType != "password" {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		if payload.Username == "" || payload.Password == "" {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
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
				Issuer:    authProvider.Name,
				IssuedAt:  now.Unix(),
				ExpiresAt: now.Add(time.Hour * 24).Unix(),
				Subject:   fmt.Sprintf("%s", claimedUser.ID),
			},
		}

		tokenString, err := authProvider.CreateToken(claims)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		// TODO: add refresh token and a handler for refreshing
		data := map[string]string{
			"access_token": tokenString,
			"token_type":   "Bearer",
			"expires_in":   fmt.Sprintf("%d", claims.ExpiresAt-time.Now().Unix()),
			"scope":        "",
		}
		headers := map[string]string{
			"Cache-Control": "no-store",
			"Pragma":        "no-cache",
		}

		render.JSONWithHeaders(w, http.StatusOK, headers, data)
	}
}

func instrospectToken(authProvider auth.Provider, store datastore.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := getJSONBodyToken(r)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
		claims, err := authProvider.ParseAndVerifyToken(tokenString)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		encoded, err := json.MarshalIndent(claims, "", "    ")
		if err != nil {
			logrus.Error(err)
		}

		w.Write(encoded)
	}
}
