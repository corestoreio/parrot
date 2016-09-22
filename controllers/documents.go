package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/anthonynsimon/parrot/config"
	"github.com/anthonynsimon/parrot/model"
	"github.com/gorilla/mux"
)

func CreateDocument(e *config.Env, w http.ResponseWriter, r *http.Request) {
	inDoc := &model.Document{}
	inDoc.Pairs = make(map[string]string)
	if err := r.ParseForm(); err != nil {
		respondJSONMessage(w, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
	}

	for k, v := range r.PostForm {
		inDoc.Pairs[k] = v[0]
	}

	err := e.DB.CreateDoc(inDoc)
	if err != nil {
		handleModelErr(w, err)
		return
	}

	fmt.Println("created!", inDoc)
}

func ShowDocument(e *config.Env, w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		respondJSONMessage(w, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
		return
	}

	doc, err := e.DB.GetDoc(id)
	if err != nil {
		handleModelErr(w, err)
		return
	}

	render(w, r, 200, "", doc)
}

func render(w http.ResponseWriter, r *http.Request, status int, template string, data interface{}) {
	switch r.Header.Get("Accept") {
	case "application/json":
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": status, "payload": data,
		})
	default: // HTML
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": status, "payload": data,
		})
		// c.HTML(status, template, data)
	}
}

// func EditDocument(c *gin.Context) {
// 	db := config.GetDB()
// 	id, err := strconv.Atoi(c.Param("id"))
// 	if err != nil {
// 		respondJSONMessage(w, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
// 		return
// 	}

// 	err := e.DB.GetDocByID(db, id)
// 	if err != nil {
// 		handleModelErr(w, err)
// 		return
// 	}

// 	render(c, http.StatusOK, gin.H{
// 		"payload": doc,
// 	}, "document/edit.html")
// }

// func UpdateDocument(c *gin.Context) {
// 	db := config.GetDB()
// 	id, err := strconv.Atoi(c.Param("id"))
// 	if err != nil {
// 		respondJSONMessage(c, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
// 		return
// 	}

// 	var inDoc model.Document
// 	if err := c.BindJSON(&inDoc); err != nil {
// 		respondJSONMessage(c, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
// 		return
// 	}
// 	inDoc.ID = id

// 	doc, err := model.UpdateDoc(db, inDoc)
// 	if err != nil {
// 		handleModelErr(c, err)
// 		return
// 	}

// 	render(c, http.StatusCreated, gin.H{
// 		"payload": doc,
// 	}, "document/show.html")
// }

// func DeleteDocument(c *gin.Context) {
// 	id, err := strconv.Atoi(c.Param("id"))
// 	if err != nil {
// 		respondJSONMessage(c, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
// 		return
// 	}

// 	deletedID, err :=
// 	if err != nil {
// 		handleModelErr(c, err)
// 		return
// 	}

// 	// render(c, http.StatusOK, doc, "")
// 	respondJSONMessage(c, http.StatusOK, "deleted document with id %d", deletedID)
// }

func respondJSONMessage(w http.ResponseWriter, status int, msg string, args ...interface{}) {
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": status, "message": fmt.Sprintf(msg, args...),
	})
}

func handleModelErr(w http.ResponseWriter, err error) {
	if err == sql.ErrNoRows {
		respondJSONMessage(w, http.StatusNotFound, http.StatusText(http.StatusNotFound))
		return
	}
	respondJSONMessage(w, http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
}
