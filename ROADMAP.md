# Parrot 1.0

> NOTE: This document is non-final. Feel free to open a Pull Request with your proposed changes.

After reviewing the features requested during the past year, as well as considering the development efforts required to move the project forward, below are the proposed changes for this project in order to reach version 1.0:

## Code and Structure Changes

1. 'Undockerization' of the project. The project structure makes a lot of assumptions about its build and deployment environment.

2. Simplification of the web app. Our current setup can be overwhelming for new contributors as there is plenty of added complexity as the project evolved. The web app will most likely be rewritten, possibly in another framework.

3. Rewrite of the API service. The current backend code has allowed the project to grow very quickly while adapting to the evolving feature set. That being said, the implementation of more elaborate features could benefit from a framework that allows the contributors to rely on community conventions, which at the same time help us lower maintenance efforts and increase developer productivity. New contributors would benefit too from the use of well-known frameworks by being able to look up existing documentation and resources which help them get started with the project structure.

## New Features

1. Import existing translation files.
2. Batch insert / update project keys.
3. Recover forgotten passwords.
4. Export all project locales.
5. (?) Version control of translations.
5. (?) Tagging support.

## Enhancements

1. Redesign of the API. The current API could benefit from a redesign that favors the primary use cases of the project, as well as a more consistent RESTful interface.
2. More translations of the web app itself (en, de, es, zh, fr, it, pt)?.
3. More filtering options (e.g. untranslated locales and keys).
4. Support for in-memory databases to simplify 'test run' and developer setup.
5. Adding tests when practical to both backend and frontend code. Will be handled as part of the rewrite.

Bugs will be included as part of the v1.0 effort on a case by case basis, depending on it's severity and implications.
