package api

import (
	"encoding/json"
	"log"
	"net/http"
)

type apiHandler func(http.ResponseWriter, *http.Request) (int, error)

func (h apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	status, err := h(w, r)
	if err != nil {
		w.WriteHeader(status)
		w.Header().Set("content-type", "application/json; charset=utf-8")
		data, _ := json.Marshal(map[string]interface{}{
			"status": status,
			"error":  http.StatusText(status),
		})
		_, err = w.Write(data)
		log.Println(err)
	}
}

func writeJSON(w http.ResponseWriter, s int, v interface{}) (int, error) {
	data, err := json.Marshal(v)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	w.Header().Set("content-type", "application/json; charset=utf-8")
	_, err = w.Write(data)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return s, nil
}
