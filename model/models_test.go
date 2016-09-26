package model

import "testing"

func TestDocSyncKeys(t *testing.T) {
	d := Document{}

	// Add initial key to test
	d.SyncKeys([]string{"testkey1", "testkey2"}, true)
	if _, ok := d.Pairs["testkey1"]; !ok {
		t.Fatal("expected 'testkey1' to be present")
	}
	if _, ok := d.Pairs["testkey2"]; !ok {
		t.Fatal("expected 'testkey2' to be present")
	}

	// Test sync keys non-additive
	d.SyncKeys([]string{"testkey1"}, false)
	if _, ok := d.Pairs["testkey2"]; ok {
		t.Fatal("expected 'testkey2' to not be present")
	}
}

func TestDocSyncKeysAdditive(t *testing.T) {
	d := Document{}

	// Add initial key to test
	d.SyncKeys([]string{"testkey1"}, true)
	if _, ok := d.Pairs["testkey1"]; !ok {
		t.Fatal("expected 'testkey1' to be present")
	}

	// Set intial key value
	d.Pairs["testkey1"] = "testvalue1"

	// Test sync keys additive
	d.SyncKeys([]string{"testkey1", "testkey2"}, true)
	if v, _ := d.Pairs["testkey1"]; v != "testvalue1" {
		t.Fatalf("expected 'testkey1' value to be 'testvalue1', got: '%s'", v)
	}
	if _, ok := d.Pairs["testkey2"]; !ok {
		t.Fatal("expected 'testkey2' to be present")
	}
}
