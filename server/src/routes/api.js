const express = require('express'),
    planetsRouter = require('./routes/planets/planets.router'),
    path = require('path'),
    app = express(),
    launchesRouter = require('./routes/launches/launches.router');

api = express.Router()
app.use('/planets', planetsRouter)
app.use('/launches', launchesRouter)

module.exports = api