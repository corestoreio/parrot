- Add cache (redis?)

- Handle HEAD locale revisions (how would this work with project keys update while using old HEAD?)
- Pass project user role on GET /projects/:id/users

- Add support for client access token and role

- Separate auth issuing service from authenticator, conform to oauth2?
- Refactor main to cli and make configurable, migrate command, serve command etc...
- Non-destructive store? Add snapshots or append only?
