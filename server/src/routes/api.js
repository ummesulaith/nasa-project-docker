const express = require('express'),
    planetsRouter = require('./planets/planets.router'),
    app = express(),
    launchesRouter = require('./launches/launches.router');

api = express.Router()
app.use('/planets', planetsRouter)
app.use('/launches', launchesRouter)

module.exports = api