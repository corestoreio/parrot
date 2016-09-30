package model

import "testing"

func TestDocSyncKeys(t *testing.T) {
	d := Document{}

	// Add initial key to test
	d.SyncKeys([]string{"testkey1", "testkey2"})
	if _, ok := d.Pairs["testkey1"]; !ok {
		t.Fatal("expected 'testkey1' to be present")
	}
	if _, ok := d.Pairs["testkey2"]; !ok {
		t.Fatal("expected 'testkey2' to be present")
	}

	// Test sync keys non-additive
	d.SyncKeys([]string{"testkey1"})
	if _, ok := d.Pairs["testkey2"]; ok {
		t.Fatal("expected 'testkey2' to not be present")
	}
}
