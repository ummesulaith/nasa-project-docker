const {getAllPlanet} = require('../../models/planets.model')

async function getAllPlanets(req,res){
  return res.status(200).json(await getAllPlanet())
}

module.exports={
  getAllPlanets,
}