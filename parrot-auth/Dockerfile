FROM golang:1.7.3-alpine

MAINTAINER Anthony Najjar Simon

RUN apk update && apk upgrade && \
    apk add --no-cache bash git

WORKDIR "$GOPATH/src/github.com/anthonynsimon/parrot/parrot-auth"
COPY . .
RUN go build

EXPOSE 8080

CMD ./parrot-auth