package postgres

import (
	"bytes"
	"errors"
	"io"
	"io/ioutil"
	"os"
	"path"
	"regexp"
)

var (
	upRegex   = regexp.MustCompile(`^([0-9]+)_(.*).up.sql$`)
	downRegex = regexp.MustCompile(`^([0-9]+)_(.*).down.sql$`)
)

func (ds *PostgresDB) MigrateUp(migrationsDir string) error {
	return ds.migrate(migrationsDir, upRegex)

}

func (ds *PostgresDB) MigrateDown(migrationsDir string) error {
	return ds.migrate(migrationsDir, downRegex)
}

func (ds *PostgresDB) migrate(migrationsDir string, fileMatcher *regexp.Regexp) error {
	if migrationsDir == "" {
		return errors.New("no migrations directory specified")
	}

	files, err := ioutil.ReadDir(migrationsDir)
	if err != nil {
		return err
	}

	buf := bytes.NewBuffer(nil)

	for _, file := range files {
		fileName := file.Name()
		if file.IsDir() || !fileMatcher.MatchString(fileName) {
			continue
		}
		data, err := os.Open(path.Join(migrationsDir, fileName))
		_, err = io.Copy(buf, data)
		if err != nil {
			return err
		}
		err = data.Close()
		if err != nil {
			return err
		}
		buf.WriteString("\n")
	}

	_, err = ds.Exec(buf.String())
	if err != nil {
		return err
	}

	return nil
}
