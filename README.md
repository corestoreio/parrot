# Parrot
Project localization system built with Go and Angular 2.
Currently in heavy development, breaking changes guaranteed :)

TODO:

Backend:
- Add snapshots feature
- Add ability to 'refactor' project keys. Propagate changes on all locales instead of removing related pairs.
- Add API retrieve snapshots groupped by locale or key
- Move docker compose into sub folder
- Add support for client access token and role
- Refactor main to cli and make configurable, migrate command, serve command etc...
- Pass project user role on GET /projects/:id/users
- Separate auth issuing service from authenticator, conform to oauth2?
- Add tests once features have been settled.
- Add cache (redis?)

Frontend:
- Add current project sidenav.
- Add contributors feature module.
- Restyle with simple custom classes?.
- Add Client API feature module (generate and manage client tokens?).
- Add API error-message map.
- Add tests.
