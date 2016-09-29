package middleware

import (
	"context"
	"fmt"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

var APISigningKey []byte

func TokenGate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := getTokenString(r)
		if err != nil {
			fmt.Println(err)
			return
		}

		claims, err := authenticateToken(tokenString)
		if err != nil {
			fmt.Println(err)
			return
		}

		ctx := contextWithClaims(r.Context(), claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func getTokenString(r *http.Request) (string, error) {
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		return "", fmt.Errorf("no auth header")
	}
	return tokenString, nil
}

func authenticateToken(ts string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(ts, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return APISigningKey, nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	if !claims.VerifyExpiresAt(time.Now().Unix(), true) {
		return nil, fmt.Errorf("token expired")
	}
	return claims, nil
}

func contextWithClaims(ctx context.Context, claims jwt.MapClaims) context.Context {
	c := context.WithValue(ctx, "userID", claims["sub"])
	c = context.WithValue(c, "role", claims["role"])
	return c
}
