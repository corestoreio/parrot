package config

import "github.com/anthonynsimon/parrot/database"

type Env struct {
	DB database.Store
}
