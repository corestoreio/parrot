package render

import (
	"encoding/json"
	"net/http"

	"github.com/Sirupsen/logrus"
	"github.com/anthonynsimon/parrot/errors"
)

var jsonContentType = "application/json; charset=utf-8"

type apiResponseBody struct {
	responseMeta `json:"meta,omitempty"`
	Payload      interface{} `json:"payload,omitempty"`
}

type responseMeta struct {
	Status int   `json:"status,omitempty"`
	Error  error `json:"error,omitempty"`
}

func Error(w http.ResponseWriter, err error) {
	status := http.StatusInternalServerError
	if e, ok := err.(*errors.Error); ok {
		status = e.Status
	}
	ErrorWithStatus(w, status, err)
}

func ErrorWithStatus(w http.ResponseWriter, status int, errs error) {
	w.Header().Set("Content-Type", jsonContentType)
	w.WriteHeader(status)

	body := apiResponseBody{
		responseMeta: responseMeta{
			Status: status,
			Error:  errs},
		Payload: nil}

	encoded, err := json.Marshal(body)
	if err != nil {
		logrus.Error(err)
	}

	w.Write(encoded)
}

func JSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", jsonContentType)
	w.WriteHeader(status)

	body := apiResponseBody{
		responseMeta: responseMeta{
			Status: status},
		Payload: payload}

	encoded, err := json.Marshal(body)
	if err != nil {
		logrus.Error(err)
	}

	w.Write(encoded)
}
