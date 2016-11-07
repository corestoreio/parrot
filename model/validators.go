package model

import "regexp"

var (
	emailRegex *regexp.Regexp
)

func init() {
	emailRegex = regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
}

func ValidEmail(str string) bool {
	return emailRegex.MatchString(str)
}

func HasMinLength(str string, min int) bool {
	return len(str) >= min
}
