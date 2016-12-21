FROM golang:1.7.3-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git

RUN go get github.com/anthonynsimon/parrot/parrot-api

WORKDIR "$GOPATH/src/github.com/anthonynsimon/parrot/parrot-api"

RUN chmod +rwx ./start.sh

EXPOSE 443

CMD ["/bin/bash", "./start.sh"]