package main

import (
	"fmt"

	"github.com/anthonynsimon/parrot/model"
	jwt "github.com/dgrijalva/jwt-go"
)

type TokenProvider struct {
	Name       string
	SigningKey []byte
}

type AuthStore interface {
	model.UserStorer
	model.ProjectClientStorer
	Ping() error
	Close() error
}

func (p *TokenProvider) CreateToken(claims jwt.Claims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(p.SigningKey)
}

func (p *TokenProvider) ParseAndVerifyToken(tokenString string) (jwt.MapClaims, error) {
	return parseAndVerify(tokenString, p.SigningKey)
}

func parseAndVerify(tokenString string, signingKey []byte) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return signingKey, nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims.Valid() != nil {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
