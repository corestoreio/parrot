package api

import (
	"bytes"
	"net/http"

	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/paths"
)

type response struct {
	Status string
	Data   interface{}
}

type APIStore struct {
	URL string
}

func New(url string) *APIStore {
	return &APIStore{URL: url}
}

func (a *APIStore) Ping() error {
	res, err := a.request("GET", paths.PingPath, nil)
	if err != nil {
		return err
	}
	if res.Status != "200" {
		return errors.ErrInternal
	}
	return nil
}

func (a *APIStore) Close() error {
	return nil
}

func (a *APIStore) request(method string, uri string, data []byte) (response, error) {
	req, err := http.NewRequest(method, a.URL+uri, bytes.NewBuffer(data))
	if err != nil {
		return response{}, err
	}

	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return response{}, err
	}
	defer res.Body.Close()

	return response{Status: res.Status, Data: nil}, nil
}
