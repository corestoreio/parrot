package render

import (
	"encoding/json"
	"net/http"

	"html/template"

	"github.com/anthonynsimon/parrot/errors"
)

var Templates *template.Template

var jsonContentType = "application/json; charset=utf-8"

func JSONError(w http.ResponseWriter, e *errors.Error) {
	data := map[string]interface{}{
		"status": e.Code,
		"error":  e.Message,
	}
	JSON(w, e.Code, data)
}

func JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", jsonContentType)
	w.WriteHeader(status)

	encoded, err := json.Marshal(data)
	if err != nil {
		http.Error(w, errors.ErrInternal.Message, errors.ErrInternal.Code)
	}

	w.Write(encoded)
}

func Template(w http.ResponseWriter, name string, data interface{}) {
	err := Templates.ExecuteTemplate(w, name, data)
	if err != nil {
		http.Error(w, errors.ErrInternal.Message, errors.ErrInternal.Code)
	}
}
