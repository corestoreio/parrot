// Package render handles the rending of common API results.
package render

import (
	"encoding/json"
	"net/http"

	"github.com/Sirupsen/logrus"
)

var (
	jsonContentType        = "application/json"
	jsonContentTypeCharset = "application/json; charset=utf-8"
)

type apiResponseBody struct {
	responseMeta `json:"meta,omitempty"`
	Payload      interface{} `json:"payload,omitempty"`
}

type responseMeta struct {
	Status int   `json:"status,omitempty"`
	Error  error `json:"error,omitempty"`
}

// Error writes an API error to the response.
func Error(w http.ResponseWriter, status int, err error) {
	w.Header().Set("Content-Type", jsonContentType)
	w.WriteHeader(status)

	body := apiResponseBody{
		responseMeta: responseMeta{
			Status: status,
			Error:  err},
		Payload: nil}

	writeJSONBody(w, body)
}

// JSON writes a payload as json to the response.
func JSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", jsonContentType)
	w.WriteHeader(status)

	body := apiResponseBody{
		responseMeta: responseMeta{
			Status: status},
		Payload: payload}

	writeJSONBody(w, body)
}

// JSONWithHeaders writes a payload as json to the response and includes the provided headers.
func JSONWithHeaders(w http.ResponseWriter, status int, headers map[string]string, payload interface{}) {
	h := w.Header()
	h.Set("Content-Type", jsonContentType)
	for k, v := range headers {
		h.Set(k, v)
	}
	w.WriteHeader(status)

	body := apiResponseBody{
		responseMeta: responseMeta{
			Status: status},
		Payload: payload}

	writeJSONBody(w, body)
}

// writeJSONBody handles the marshalling and writing of the response body.
func writeJSONBody(w http.ResponseWriter, body apiResponseBody) {
	encoded, err := json.MarshalIndent(body, "", "    ")
	if err != nil {
		logrus.Error(err)
	}

	w.Write(encoded)
}
