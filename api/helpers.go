package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/anthonynsimon/parrot/log"
)

var (
	jsonContentType = "application/json; charset=utf-8"
)

type apiHandler func(http.ResponseWriter, *http.Request) (int, error)

func (h apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonContentType)

	start := time.Now()
	status, err := h(w, r)
	end := time.Now()

	log.Request(end, status, end.Sub(start), r.RemoteAddr, r.Method, r.URL.String())

	if err != nil {
		w.WriteHeader(status)
		data, err := json.Marshal(map[string]interface{}{
			"status": status,
			"error":  http.StatusText(status),
		})

		_, err = w.Write(data)
		if err != nil {
			log.Warning(err.Error())
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
