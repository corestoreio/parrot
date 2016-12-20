// Package export handles the exporting of API data to common formats.
package export

import "github.com/anthonynsimon/parrot/parrot-api/model"

// Exporter specifies the interface that must be specified for every format.
type Exporter interface {
	FileExtension() string
	Export(*model.Locale) ([]byte, error)
}
