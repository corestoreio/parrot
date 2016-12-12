package main

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"os"

	"encoding/json"

	"github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/auth"
	"github.com/anthonynsimon/parrot/datastore"
	"github.com/anthonynsimon/parrot/logger"
	"github.com/anthonynsimon/parrot/model"
	"github.com/anthonynsimon/parrot/render"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/schema"
	"github.com/pressly/chi"
	"github.com/pressly/chi/middleware"
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

func init() {
	// Config log
	logrus.SetOutput(os.Stdout)
	logrus.SetFormatter(&logrus.TextFormatter{})
	logrus.SetLevel(logrus.InfoLevel)
}

func main() {
	// init and ping datastore
	dbName := os.Getenv("PARROT_DB_NAME")
	dbURL := os.Getenv("PARROT_DB_URL")
	if dbName == "" || dbURL == "" {
		logrus.Fatal("no db set in env")
	}

	ds, err := datastore.NewDatastore(dbName, dbURL)
	if err != nil {
		logrus.Fatal(err)
	}
	defer ds.Close()

	// Ping DB until service is up, block meanwhile
	blockAndRetry(5*time.Second, func() bool {
		if err = ds.Ping(); err != nil {
			logrus.Error(fmt.Sprintf("failed to ping datastore.\nerr: %s", err))
			return false
		}
		return true
	})

	// init routers and middleware
	// CORS, Rate-limiting, etc... is handled by the server (e.g. nginx)
	// Here we only care about application level middleware
	router := chi.NewRouter()
	router.Use(
		middleware.RequestID,
		middleware.RealIP,
		logger.Request,
		middleware.StripSlashes,
	)

	signingKey := os.Getenv("PARROT_AUTH_SIGNING_KEY")
	if signingKey == "" {
		logrus.Fatal("no auth signing key set in env")
	}

	ap := auth.Provider{Name: "LOCAL_DEV", SigningKey: []byte(signingKey)}

	router.Post("/auth/authenticate", authenticate(ap, ds))
	router.Post("/auth/introspect", instrospectToken(ap, ds))

	// config server
	addr := os.Getenv("PARROT_AUTH_SERVER_PORT")
	if addr == "" {
		addr = ":8080"
	}

	// init server
	s := &http.Server{
		Addr:           addr,
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	logrus.Info(fmt.Sprintf("Listening on %s", addr))

	logrus.Fatal(s.ListenAndServe())
}

func blockAndRetry(d time.Duration, fn func() bool) {
	for !fn() {
		fmt.Printf("retrying in %s...\n", d.String())
		time.Sleep(d)
	}
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
			"token_type":   "bearer",
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
