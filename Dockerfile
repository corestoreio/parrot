FROM golang:1.7.3-alpine

MAINTAINER Anthony Najjar Simon

# RUN apk add --update bash git
# RUN apk add --update bash

# RUN go get github.com/anthonynsimon/parrot

WORKDIR "$GOPATH/src/github.com/anthonynsimon/parrot"
COPY . .

EXPOSE 8080

RUN go build
CMD ["./parrot"]
