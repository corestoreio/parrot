# Parrot
Project localization system built with Go and Angular 2.
Currently in heavy development, breaking changes guaranteed :)

TODO:

General:
- Add service discovery
- Add centralized config and secret sharing storage

Backend:
- Add project client authorization handlers
- Handle project client roles and developer roles
- Separate auth issuing service from authenticator, conform to oauth2?
- Add update user password, name
- Add export as JSON, csv, xml (android resources), strings (apple strings), Excel sheet?
- Refactor main to cli and make configurable, migrate command, serve command etc...
- Move docker compose into sub folder
- Add snapshots feature
- Add API retrieve snapshots groupped by locale or key
- Add tests once features have been settled.
- Add cache (redis?)

Frontend:
- Add edit user pages (self)
- Handle api errors presentation
- Add API error-message map
- Add app localization
- Add snapshots feature UI
- Add tests
