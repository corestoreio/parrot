package api

import "net/http"
import "github.com/pressly/chi"

import "github.com/anthonynsimon/parrot/parrot-api/export"
import "bytes"
import "fmt"
import "strings"

func exportLocale(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}
	localeIdent := chi.URLParam(r, "localeIdent")
	if projectID == "" {
		handleError(w, ErrBadRequest)
		return
	}
	i18nType := chi.URLParam(r, "type")
	if i18nType == "" {
		handleError(w, ErrBadRequest)
		return
	}

	locale, err := store.GetProjectLocaleByIdent(projectID, localeIdent)
	if err != nil {
		handleError(w, err)
		return
	}

	var exporter export.Exporter
	switch strings.ToLower(i18nType) {
	case "keyvaluejson":
		exporter = &export.JSON{}
	case "po":
		exporter = &export.Gettext{}
	case "strings":
		exporter = &export.AppleStrings{}
	case "properties":
		exporter = &export.JavaProperties{}
	case "xmlproperties":
		exporter = &export.JavaXML{}
	case "android":
		exporter = &export.Android{}
	default:
		handleError(w, ErrBadRequest)
		return
	}

	result, err := exporter.Export(locale)
	if err != nil {
		handleError(w, err)
		return
	}

	filename := fmt.Sprintf("%s.%s", localeIdent, exporter.FileExtension())

	header := w.Header()
	header.Set("Content-Type", "application/octet-stream")
	header.Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	header.Set("Content-Length", fmt.Sprintf("%d", len(result)))

	buf := bytes.NewBuffer(result)
	_, err = buf.WriteTo(w)
	if err != nil {
		handleError(w, err)
		return
	}
}
