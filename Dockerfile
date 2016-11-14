FROM golang:1.7.3-alpine

MAINTAINER Anthony Najjar Simon

WORKDIR "$GOPATH/src/github.com/anthonynsimon/parrot"
COPY . .

EXPOSE 8080

RUN go build
CMD ["./parrot"]
