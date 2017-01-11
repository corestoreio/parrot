# Parrot
[![Docs](https://readthedocs.org/projects/docs/badge/?version=latest)](https://anthonynsimon.gitbooks.io/parrot/content/)
[![Docker Automated buil](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](https://hub.docker.com/r/anthonynsimon/parrot-api/)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/anthonynsimon/parrot/blob/master/LICENSE)  

Self-hosted Localization Management software built with Go and Angular 2.  

> NOTICE: the project is still in heavy development and it is NOT recommended for use in production until a version 1.0 is reached.

<img src="https://raw.githubusercontent.com/anthonynsimon/parrot.github.io/master/images/parrot-screenshot-001.png" style="width: 720px;"/>

## Try it out

The easiest way to get started is using Docker. Simply clone this repo, navigate to the root of it and start the services:

> Please note that to build the web app, `npm` is required.

```
$ git clone https://github.com/anthonynsimon/parrot.git
$ cd parrot
$ sudo /bin/bash scripts/release.sh
$ sudo /bin/bash scripts/start.sh
```

This will build the web app and launch 3 containers: a Postgres **database**, the Parrot **API server** and Nginx as the **reverse proxy and static file server**.

Navigate to https://localhost/api/v1/ping and you should be able to see if the API is up (your browser will complain about an unknown certificate, see the HTTPS notice below for more info).

And to view the web app simply navigate to https://localhost, it should open the login page of the web app.

### Important note on HTTPS

For convinience, self-signed SSL certificates are provided for the reverse-proxy (nginx). Do **NOT** use them for anything other than development, 
use your own certificates instead. We recommended automating the generation and renewal of the certificates via Let's Encrypt.
The `/etc/nginx/certs` and `/etc/nginx/vhost.d` volumes on the nginx container has been made available for this purpose.  

## License
This project is licensed under the [MIT](https://github.com/anthonynsimon/parrot/blob/master/LICENSE) license.

## Issues
The recommended medium to report and track issues is by opening one on [Github](https://github.com/anthonynsimon/parrot).

## Contributing
Want to hack on the project? Any kind of contribution is welcome!
Simply follow the next steps:

- Fork the project.
- Create a new branch.
- Make your changes and write tests when practical.
- Commit your changes to the new branch.
- Send a pull request, it will be reviewed shortly.

In case you want to add a feature, please create a new issue and briefly explain what the feature would consist of. For bugs or requests, before creating an issue please check if one has already been created for it.
