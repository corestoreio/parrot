package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"time"

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
	js, err := a.request("GET", paths.PingPath, nil)
	if err != nil {
		return err
	}

	if status, ok := js["status"]; !ok || status != "200" {
		return errors.ErrInternal
	}
	return nil
}

func (a *APIStore) Close() error {
	return nil
}

func (a *APIStore) request(method, uri string, data interface{}) (map[string]interface{}, error) {
	encoded, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(method, a.URL+uri, bytes.NewBuffer(encoded))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Timeout: time.Second * 10,
	}

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var out map[string]interface{}
	err = json.NewDecoder(res.Body).Decode(&out)
	if err != nil {
		return nil, err
	}

	if v, ok := out["error"]; ok {
		return nil, errors.New(res.StatusCode, v.(string))
	}

	return out, nil
}
