# Parrot
[![Docs](https://readthedocs.org/projects/docs/badge/?version=latest)](https://anthonynsimon.gitbooks.io/parrot/content/)
[![Docker Automated buil](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](https://hub.docker.com/r/anthonynsimon/parrot-api/)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/anthonynsimon/parrot/blob/master/LICENSE)  

Self-hosted Localization Management Service built with Go and Angular 2.  
Currently in heavy development, breaking changes guaranteed :)

## Todo

General:
- Improve documentation.
- Add frontend app to build pipeline.
- Add import feature.
- Add snapshots feature (project state backups).
- Add forgotten password feature.
- Add auto SSL certificates via let's encrypt.

Backend:
- Add timestamps to DB tables.
- Add tests when practical.

Frontend:
- Localize the web app.
- Cleanup CSS, switch to SASS?.
- Add tests when practical.

## Try it out

> NOTICE: the project is still in heavy development and it is NOT recommended for use in production until a version 1.0 is reached.

The easiest way to get started is using Docker. Simply clone this repo, navigate to the root of it and start the services:
```
$ git clone https://github.com/anthonynsimon/parrot.git
$ cd parrot
$ bash start.sh
```
This will launch 3 containers: a Postgres database, the Parrot API server and Nginx as the reverse proxy and static file server.

Navigate to https://localhost/api/v1/ping and you should be able to see if the API is up (your browser might complain about an unkown certificate, this issue will be addressed soon).

And to view the web app simply navigate to https://localhost, it should open the login page of the web app.

### Important note on HTTPS

For convinience, self-signed SSL certificates are provided for the reverse-proxy (nginx). Do NOT use these for production, 
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
