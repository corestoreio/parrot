FROM golang:1.7.3-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git

RUN mkdir -p $GOPATH/src/github.com/anthonynsimon

WORKDIR "$GOPATH/src/github.com/anthonynsimon"

COPY ./scripts/docker-start.sh .

RUN chmod +rwx ./docker-start.sh

EXPOSE 443

CMD ["/bin/bash", "./docker-start.sh"]
    