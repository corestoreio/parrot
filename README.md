# Parrot
Project localization system built with Go and Angular 2.
Currently in heavy development, breaking changes guaranteed :)

TODO:

Backend:
- Add ability to 'refactor' project keys. Propagate changes on all locales instead of removing related pairs.
- Add snapshots feature
- Add API retrieve snapshots groupped by locale or key
- Pass project user role on GET /projects/:id/users
- Add support for client access token and role
- Move docker compose into sub folder
- Refactor main to cli and make configurable, migrate command, serve command etc...
- Separate auth issuing service from authenticator, conform to oauth2?
- Add tests once features have been settled.
- Add cache (redis?)

Frontend:
- Add contributors feature module.
- Add Client API feature module (generate and manage client tokens?).
- Add API error-message map.
- Add tests.
