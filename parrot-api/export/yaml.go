package export

import (
	"strings"

	"github.com/anthonynsimon/parrot/parrot-api/model"
	"gopkg.in/yaml.v2"
)

type Yaml struct{}

func (e *Yaml) FileExtension() string {
	return "po"
}

// TODO: allow for non-nested style export.
// What about formats like excel and apple strings?
func (e *Yaml) Export(locale *model.Locale) ([]byte, error) {
	nestedPairs := getNestedKVPairs(locale.Pairs, ".")
	data := make(map[string]interface{})
	data[locale.Ident] = nestedPairs
	result, err := yaml.Marshal(data)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// func (e *Yaml) Export(locale *model.Locale) ([]byte, error) {
// 	data := make(map[string]map[string]interface{})
// 	data[locale.Ident] = make(map[string]interface{})
// 	for k, v := range locale.Pairs {
// 		data[locale.Ident][k] = v
// 	}

// 	result, err := yaml.Marshal(data)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return result, nil
// }

func getNestedKVPairs(pairs map[string]string, separator string) interface{} {
	data := make(map[string]interface{})
	for k, v := range pairs {
		nesting := strings.Split(k, separator)
		current := data
		for i, nk := range nesting {
			if i < len(nesting)-1 {
				if current[nk] == nil {
					current[nk] = make(map[string]interface{})
				}
				current = current[nk].(map[string]interface{})
			} else {
				current[nk] = v
			}
		}
	}
	return data
}
