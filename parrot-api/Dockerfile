FROM golang:1.7.3-alpine

MAINTAINER Anthony Najjar Simon

RUN apk update && apk upgrade && \
    apk add --no-cache bash git

WORKDIR "$GOPATH/src/github.com/anthonynsimon/parrot/parrot-api"
COPY . .
RUN go build

RUN go get -u github.com/rnubel/pgmgr

EXPOSE 8080

CMD ./parrot-api