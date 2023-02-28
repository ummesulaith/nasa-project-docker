const express = require('express'),
 launchesController = require('./launches.controller'),
 launchessRouter = express.Router()

 launchessRouter.get('/',launchesController.httpgetAllLaunches)

 launchessRouter.post('/',launchesController.httpaddNewLanch)

 launchessRouter.delete('/:id',launchesController.httpAbortLaunch)

module.exports =  launchessRouter
