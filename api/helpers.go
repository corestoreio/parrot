package api

import (
	"encoding/json"
	"net/http"
)

var (
	jsonContentType = "application/json; charset=utf-8"
)

type apiHandler func(http.ResponseWriter, *http.Request) (int, error)

func (h apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonContentType)
	status, err := h(w, r)
	if err != nil {
		// TODO log err
		w.WriteHeader(status)
		data, err := json.Marshal(map[string]interface{}{
			"status": status,
			"error":  http.StatusText(status),
		})
		if err != nil {
			// log
		}
		_, err = w.Write(data)
		if err != nil {
			// log
		}
	}
}

func writeJSON(w http.ResponseWriter, s int, v interface{}) (int, error) {
	data, err := json.Marshal(v)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	_, err = w.Write(data)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return s, nil
}
