package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/anthonynsimon/parrot/config"
	"github.com/anthonynsimon/parrot/model"
	"github.com/gin-gonic/gin"
)

func CreateDocument(e *config.Env, c *gin.Context) {
	doc := &model.Document{}
	doc.Pairs = make(map[string]string)
	if err := c.Request.ParseForm(); err != nil {
		respondJSONMessage(c, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
	}

	for k, v := range c.Request.PostForm {
		doc.Pairs[k] = v[0]
	}

	err := e.DB.CreateDoc(doc)
	if err != nil {
		handleModelErr(c, err)
		return
	}

	render(c, http.StatusCreated, doc)
}

func ShowDocument(e *config.Env, c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		respondJSONMessage(c, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
		return
	}

	doc, err := e.DB.GetDoc(id)
	if err != nil {
		handleModelErr(c, err)
		return
	}

	render(c, 200, doc)
}

func UpdateDocument(env *config.Env, c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		respondJSONMessage(c, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
		return
	}

	var doc *model.Document
	if err := c.BindJSON(&doc); err != nil {
		respondJSONMessage(c, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
		return
	}
	doc.ID = id

	err = env.DB.UpdateDoc(doc)
	if err != nil {
		handleModelErr(c, err)
		return
	}

	render(c, http.StatusCreated, doc)
}

func DeleteDocument(env *config.Env, c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		respondJSONMessage(c, http.StatusBadRequest, http.StatusText(http.StatusBadRequest))
		return
	}

	resultID, err := env.DB.DeleteDoc(id)
	if err != nil {
		handleModelErr(c, err)
		return
	}

	render(c, http.StatusOK, fmt.Sprintf("document with id = %d deleted", resultID))
}
