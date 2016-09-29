package render

import (
	"encoding/json"
	"net/http"
)

var jsonContentType = "application/json; charset=utf-8"

func JSONError(w http.ResponseWriter, status int) {
	data := map[string]interface{}{
		"status": status,
		"error":  http.StatusText(status),
	}
	JSON(w, status, data)
}

func JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", jsonContentType)
	w.WriteHeader(status)

	encoded, err := json.Marshal(data)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}

	w.Write(encoded)
}
