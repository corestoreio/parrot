package export

import (
	"bytes"

	"fmt"

	"strings"

	"github.com/anthonynsimon/parrot/parrot-api/model"
	"github.com/bjarneh/latinx"
)

type JavaProperties struct{}

func (e *JavaProperties) FileExtension() string {
	return "properties"
}

func (e *JavaProperties) ContentType() string {
	return "text/plain; charset=UTF-16"
}

func (e *JavaProperties) Export(locale *model.Locale) ([]byte, error) {
	buf := bytes.NewBuffer(nil)

	for k, v := range locale.Pairs {
		_, err := buf.WriteString(fmt.Sprintf("%s = %s\n", strings.Replace(k, " ", "\\ ", -1), v))
		if err != nil {
			return nil, err
		}
	}

	conv := latinx.Get(latinx.ISO_8859_1)
	latin, _, err := conv.Encode(buf.Bytes())
	if err != nil {
		return nil, err
	}

	return latin, nil
}
