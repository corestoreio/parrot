package model

import "testing"

func TestLocaleSyncKeys(t *testing.T) {
	l := Locale{}

	// Add initial key to test
	l.SyncKeys([]string{"testkey1", "testkey2"})
	if _, ok := l.Pairs["testkey1"]; !ok {
		t.Fatal("expected 'testkey1' to be present")
	}
	if _, ok := l.Pairs["testkey2"]; !ok {
		t.Fatal("expected 'testkey2' to be present")
	}

	// Test sync keys non-additive
	l.SyncKeys([]string{"testkey1"})
	if _, ok := l.Pairs["testkey2"]; ok {
		t.Fatal("expected 'testkey2' to not be present")
	}
}
