package api

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/anthonynsimon/parrot/errors"
	"github.com/anthonynsimon/parrot/paths"
)

type APIStore struct {
	URL string
}

func New(url string) *APIStore {
	return &APIStore{URL: url}
}

func (a *APIStore) Ping() error {
	var res map[string]interface{}
	err := a.request("GET", paths.PingPath, nil, &res)
	if err != nil {
		return err
	}
	if status, ok := res["status"]; !ok || status != "200" {
		return errors.ErrInternal
	}
	return nil
}

func (a *APIStore) Close() error {
	return nil
}

func (a *APIStore) request(method string, uri string, data []byte, out interface{}) error {
	req, err := http.NewRequest(method, a.URL+uri, bytes.NewBuffer(data))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	err = json.NewDecoder(res.Body).Decode(out)
	if err != nil {
		return err
	}

	return nil
}
