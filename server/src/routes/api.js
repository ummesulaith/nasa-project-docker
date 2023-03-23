const express = require('express'),
    planetsRouter = require('./planets/planets.router'),
    launchesRouter = require('./launches/launches.router');

api = express.Router()
api.use('/planets', planetsRouter)
api.use('/launches', launchesRouter)

module.exports = api