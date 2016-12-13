# Parrot
Project localization system built with Go and Angular 2.
Currently in heavy development, breaking changes guaranteed :)

TODO:

General:
- Add copy web app build to nginx as a static server

Backend:
- Add monitoring, edge Server, API Gateway and ELK Stack for logging ?
- Add project client authorization handlers
- Handle project client roles and developer roles
- Add export as JSON, csv, xml (android resources), strings (apple strings), Excel sheet? (as an exports microservice?)
- Support migrations via .env files (e.g. db.migrations.strategy="create/drop" or "up")
- Communicate only via SSL within the microservices network
- Add snapshots feature (as a snapshots microservice?)
- Add API retrieve snapshots groupped by locale or key
- Add timestamps to DB tables
- Add tests

Frontend:
- Handle api errors presentation
- Add API error-message map
- Add app localization
- Add snapshots feature UI
- Add tests
