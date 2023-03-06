const { parse } = require('csv-parse'),
    fs = require('fs'),
    planets = require('./planets.mongo'),
    path = require('path');

const results = [], habitablePlanet = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {

                     savePlanet(data)
                    // habitablePlanet.push(data)
                }
                // results.push(data)
            })
            .on('error', (err) => {
                console.log(err)
                reject(err)
            })
            .on('end', async() => {
                // console.log(habitablePlanet.map((planet) => {
                //     return planet['kepler_name']
                // }))
                const countPlanetsFound = (await getAllPlanet()).length
                console.log('the number of habitable planet are', countPlanetsFound)
                console.log('all done')
                resolve()
            })

    })
}

async function getAllPlanet() {
    return await planets.find({},{
        '_id':0,'__v':0
    })
}

async function savePlanet(planet){
    try {
        await planets.updateOne({ keplerName: planet.kepler_name },{
            keplerName: planet.kepler_name
        },{
            upsert:true
        })
    } catch (error) {
        console.log('error occurred during upsert', error)
    }
}

module.exports = {
    planets: habitablePlanet,
    loadPlanetsData,
    getAllPlanet
}
