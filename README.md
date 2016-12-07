# Parrot
Project localization system built with Go and Angular 2.
Currently in heavy development, breaking changes guaranteed :)

TODO:

General:
- Add service discovery
- Add centralized config and secret sharing storage

Backend:
- Add snapshots feature
- Add API retrieve snapshots groupped by locale or key
- Add export as JSON, csv, xml (android resources), strings (apple strings),  Excel sheet?
- Add send email to users on project assign, create user if not registered and assign temporary password
- Add update user password, name
- Refactor main to cli and make configurable, migrate command, serve command etc...
- Separate auth issuing service from authenticator, conform to oauth2?
- Add tests once features have been settled.
- Add cache (redis?)
- Move docker compose into sub folder

Frontend:
- Add API error-message map.
- Add app localization.
- Add edit user pages (self).
- Add snapshots feature UI.
- Add tests.
