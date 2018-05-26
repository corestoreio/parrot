# Parrot
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ada80e50064e4d6a858c1e2e2164436a)](https://app.codacy.com/app/anthonynajjars/parrot?utm_source=github.com&utm_medium=referral&utm_content=parrot-translate/parrot&utm_campaign=badger)
[![Docs](https://img.shields.io/badge/docs-latest-blue.svg)](https://anthonynsimon.gitbooks.io/parrot/content/)
[![MIT License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/parrot-translate/parrot/blob/master/LICENSE)

Self-hosted Localization Management Platform built with Go and Angular 2.  

[Documentation](https://anthonynsimon.gitbooks.io/parrot/content/)  
[Website](http://parrot-translate.github.io/parrot.github.io/)  
[Gitter Chat Room](https://gitter.im/parrot-translate)   

Check out the [Roadmap](https://github.com/parrot-translate/parrot/blob/master/ROADMAP.md) for v1.0, it's open for discussion. Everyone is welcome to contribute.

> NOTICE: the project is still in heavy development and it is NOT recommended for use in production until a version 1.0 is reached.

<img src="https://parrot-translate.github.io/parrot.github.io/images/parrot-screenshot-001.png" style="width: 720px;"/>

## Features

- Built-in UI (web app) ready to deploy.
- REST API to easily extend or integrate Parrot into your pipeline.
- Export to various formats: keyvaluejson, `po`, `strings`, `properties`, `xmlproperties`, `android`, `php`, `xlsx`, `yaml` and `csv`.
- Easily rename project strings, Parrot takes care of keeping locales in sync.
- Manage your project's team, assign collaborators and their roles.
- Control API Client access for your projects.

## Building from source and try it out

Start out by cloning this repo into your GOPATH:

```bash
$ mkdir -p $GOPATH/src/github.com/parrot-translate/parrot
$ cd $GOPATH/src/github.com/parrot-translate/parrot
$ git clone https://github.com/parrot-translate/parrot.git .
```

Make sure you have Postgres running, by default Parrot's API server will look for it on `postgres://localhost:5432` and will try to connect to a database named `parrot`. You can configure this using the AppConfig, see the configuration section below for more info.

To start a pre-configured Postgres instance on docker, simply run:

```bash
$ dev-tools/start-postgres.sh
```

Now apply the database migrations. Using Alembic it's really simple:

```bash
$ cd migrations
$ alembic upgrade head
```

Once again, if you wish to configure the DB parameters, you need to override the default values. For Alembic you just need to go to the `migrations/alembic.ini` file and modify the `sqlalchemy.url` accordingly.

Finally you can build Parrot from source:

```bash
# From the root dir 'parrot'
$ ./build/build-all.sh
```

Now we simply need start the API and serve the web app files.

```bash
$ dist/parrot_api
```
Navigate to http://localhost:9990/api/v1/ping and you should be able to see if the API is up.

And on a separate terminal session, let's start a convinient Python HTTP server to serve the static web app files locally:

```bash
$ dev-tools/serve-web-app.sh
```

And to view the web app simply navigate to http://localhost:8080, it should open the login page of the web app.

## Configuration
### API
At the moment, configuring the API app is only possible via environment variables. Here's the available options with their default values:

```
PARROT_API_PORT, default value: "9990"
PARROT_DB_NAME, default value: "postgres"
PARROT_DB_CONN, default value: "postgres://postgres@localhost:5432/parrot?sslmode=disable"
PARROT_AUTH_ISSUER, default value: "parrot@localhost"
PARROT_AUTH_SIGNING_KEY, default value: "secret"
```

### Web App
You can also configure the Web App's backend endpoint by editing the file `parrot/web-app/src/environments/environment.prod.ts` accordingly before building the Web app. Available options:

```
apiEndpoint, default value: "http://localhost:9990/api/v1"
```

## License
This project is licensed under the [MIT](https://github.com/anthonynsimon/parrot/blob/master/LICENSE) license.

## Issues
The recommended medium to report and track issues is by opening one on [Github](https://github.com/parrot-translate/parrot/issues).

## Contributing
Want to hack on the project? Any kind of contribution is welcome!
Simply follow the next steps:

- Fork the project.
- Create a new branch.
- Make your changes and write tests when practical.
- Commit your changes to the new branch.
- Send a pull request, it will be reviewed shortly.

In case you want to add a feature, please create a new issue and briefly explain what the feature would consist of. For bugs or requests, before creating an issue please check if one has already been created for it.
