# Parrot
Project localization system built with Go and Angular 2.
Currently in heavy development, breaking changes guaranteed :)

TODO:

Backend:
- Add snapshots feature
- Add API retrieve snapshots groupped by locale or key
- Add export as JSON, csv, xml (android resources), strings (apple strings),  Excel sheet?
- Add send email to users on project assign, create user if not registered and assign temporary password
- Add update user password, name
- Add support for client access token and role
- Refactor main to cli and make configurable, migrate command, serve command etc...
- Separate auth issuing service from authenticator, conform to oauth2?
- Add tests once features have been settled.
- Add cache (redis?)
- Move docker compose into sub folder

Frontend:
- Add Client API feature module (generate and manage client tokens?).
- Add API error-message map.
- Add app localization.
- Add edit user pages (self)
- Add tests.
