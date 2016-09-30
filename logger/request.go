package logger

import (
	"net/http"
	"time"

	log "github.com/Sirupsen/logrus"
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

func Request(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rw := responseWriter{Status: 200, Writer: w}
		next.ServeHTTP(&rw, r)
		log.WithFields(map[string]interface{}{
			"status":  rw.Status,
			"latency": time.Since(start),
			"ip":      r.RemoteAddr,
			"method":  r.Method,
			"url":     r.URL.String(),
		}).Info()
	})
}
