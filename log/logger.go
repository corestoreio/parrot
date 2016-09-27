package log

import (
	"fmt"
	"io"
	"log"
	"os"
	"time"
)

var output io.Writer
var dateFmt string

var (
	red     = string([]byte{27, 91, 57, 55, 59, 52, 49, 109})
	green   = string([]byte{27, 91, 57, 55, 59, 52, 50, 109})
	blue    = string([]byte{27, 91, 57, 55, 59, 52, 52, 109})
	yellow  = string([]byte{27, 91, 57, 55, 59, 52, 51, 109})
	magenta = string([]byte{27, 91, 57, 55, 59, 52, 53, 109})
	none    = string([]byte{27, 91, 48, 109})
)

func init() {
	output = os.Stderr
	dateFmt = "2006/01/02 - 15:04:05"
}

func SetOutput(w io.Writer) {
	output = w
}

func DateFormat(f string) {
	dateFmt = f
}

func Fatal(v ...interface{}) {
	fmt.Fprintf(output, "[%s FATAL %s] %v", red, none, time.Now().Format(dateFmt))
	log.Fatal(v...)
}

func Info(message string) {
	fmt.Fprintf(output, "[ INFO ] %v %s\n", time.Now().Format(dateFmt), message)
}

func Warning(message string) {
	fmt.Fprintf(output, "[%s WARNING %s] %v %s\n", magenta, none, time.Now().Format(dateFmt), message)
}

func Debug(message string) {
	fmt.Fprintf(output, "[%s DEBUG %s] %v %s\n", yellow, none, time.Now().Format(dateFmt), message)
}

func Request(date time.Time, status int, latency time.Duration, ip, method, path string) {
	statusColor := colorForStatus(status)
	fmt.Fprintf(output, "[ INFO ] %v |%s %3d %s| %14v | %s | %s %s\n",
		date.Format(dateFmt),
		statusColor, status, none,
		latency,
		ip,
		method, path)
}

func colorForStatus(code int) string {
	switch {
	case code >= 200 && code < 300:
		return green
	case code >= 300 && code < 400:
		return magenta
	case code >= 400 && code < 500:
		return blue
	default:
		return red
	}
}
