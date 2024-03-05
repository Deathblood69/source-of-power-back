<div align="center">
<p>
  <img src="ressources/logo.svg" width="200" alt="Nest Logo" />
</p>
<h1>Source of Power</h1>
</div>

## Description

Un jeu de stratégie et d'influence

## Installation

Installation des dépendances

```bash
$npm install
```

Création de l'image docker du projet

```bash
docker build -f app.dockerfile -t sop-back-image .
```

Préparation de la base de données

```bash
docker build -f database.dockerfile -t postgre_sop-image .
docker run -d -p 5432:5432 --name sop-postgres-container postgre_sop-image
npm run migration:run
```

## Lancement de l'application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
