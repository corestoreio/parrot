// Package logger implements middleware loggeing.
package logger

import (
	"net/http"
	"time"

	"github.com/Sirupsen/logrus"
)

// responseWriter implements the http.ResponseWriter interface and
// keeps track of the header status
type responseWriter struct {
	Status int
	Writer http.ResponseWriter
}

func (rw *responseWriter) Header() http.Header {
	return rw.Writer.Header()
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	return rw.Writer.Write(b)
}

func (rw *responseWriter) WriteHeader(s int) {
	rw.Status = s
	rw.Writer.WriteHeader(s)
}

// Request returns an http.Handler that can be used as middleware to log requests.
func Request(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rw := responseWriter{Status: 200, Writer: w}
		defer func() {
			logrus.WithFields(map[string]interface{}{
				"status":  rw.Status,
				"latency": time.Since(start),
				"ip":      r.RemoteAddr,
				"method":  r.Method,
				"url":     r.URL.String(),
			}).Info()
		}()
		next.ServeHTTP(&rw, r)
	})
}
