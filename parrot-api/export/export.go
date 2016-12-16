package export

import "github.com/anthonynsimon/parrot/parrot-api/model"

type Exporter interface {
	ContentType() string
	FileExtension() string
	Export(*model.Locale) ([]byte, error)
}
