package middleware

import (
	"fmt"
	"log"
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
)

func ValidateAuthToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")

		if len(authHeader) <= 0 {
			log.Println("TODO: return invalid auth header")
			return
		}

		token, err := jwt.Parse(authHeader, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return []byte("secret"), nil
		})
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			// TODO
			fmt.Println(err)
			return
		}

		fmt.Println(claims["sub"])

		next.ServeHTTP(w, r)
	})
}
