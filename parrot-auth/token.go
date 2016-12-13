package main

import (
	"fmt"

	"github.com/anthonynsimon/parrot/common/model"
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
	claims, err := p.ParseAndExtractClaims(tokenString)
	if err != nil {
		return nil, err
	}
	if err := claims.Valid(); err != nil {
		return nil, err
	}

	return claims, nil
}

func (p *TokenProvider) ParseAndExtractClaims(tokenString string) (jwt.MapClaims, error) {
	token, err := parseToken(tokenString, p.SigningKey)
	if err != nil {
		return nil, err
	}

	claims, err := extractClaims(token)
	if err != nil {
		return nil, err
	}

	return claims, nil
}

func parseToken(tokenString string, signingKey []byte) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return signingKey, nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	return token, nil
}

func extractClaims(token *jwt.Token) (jwt.MapClaims, error) {
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid token")
	}
	return claims, nil
}
