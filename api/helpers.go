package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func render(c *gin.Context, status int, data interface{}) {
	switch c.Request.Header.Get("Accept") {
	default:
		json.NewEncoder(c.Writer).Encode(map[string]interface{}{
			"status": status, "payload": data,
		})
	}
}

func respondJSONMessage(c *gin.Context, status int, msg string, args ...interface{}) {
	json.NewEncoder(c.Writer).Encode(map[string]interface{}{
		"status": status, "message": fmt.Sprintf(msg, args...),
	})
}

func handleModelErr(c *gin.Context, err error) {
	if err == sql.ErrNoRows {
		respondJSONMessage(c, http.StatusNotFound, http.StatusText(http.StatusNotFound))
		return
	}
	respondJSONMessage(c, http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
}
