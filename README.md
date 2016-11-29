# Parrot
WIP - Project localization system built with Go (backend) and Angular 2 (frontend).

TODO:

Backend:
- Move docker compose into sub folder
- Add support for client access token and role
- Refactor main to cli and make configurable, migrate command, serve command etc...
- Handle HEAD locale revisions (how would this work with project keys update while using old HEAD?)
- Pass project user role on GET /projects/:id/users
- Separate auth issuing service from authenticator, conform to oauth2?
- Make store non-destructive. Add snapshots?
- Add tests once features have been settled.
- Add cache (redis?)

Frontend:
- Add current project sidenav.
- Add contributors feature module.
- Restyle with simple custom classes?.
- Add Client API feature module (generate and manage client tokens?).
- Add API error-message map.
- Add typings.
- Add tests.
