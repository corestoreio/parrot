package api

import "net/http"

func options(w http.ResponseWriter, r *http.Request) error {
	w.WriteHeader(200)
	return nil
}
