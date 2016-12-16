package export

import "github.com/anthonynsimon/parrot/parrot-api/model"

type Exporter interface {
	FileExtension() string
	Export(*model.Locale) ([]byte, error)
}
