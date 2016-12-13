# Parrot
Project localization system built with Go and Angular 2.
Currently in heavy development, breaking changes guaranteed :)

TODO:

Backend:
- Add monitoring, edge Server, API Gateway and ELK Stack for logging ?
- Add project client authorization handlers
- Handle project client roles and developer roles
- Add update user password, name
- Add export as JSON, csv, xml (android resources), strings (apple strings), Excel sheet?
- Support migrations via .env files (e.g. db.migrations.strategy="create/drop" or "up")
- Communicate only via SSL within the microservices network
- Add snapshots feature
- Add API retrieve snapshots groupped by locale or key
- Add tests

Frontend:
- Add edit user pages (self)
- Handle api errors presentation
- Add API error-message map
- Add app localization
- Add snapshots feature UI
- Add tests
