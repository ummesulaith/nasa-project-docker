const { parse } = require('csv-parse'),
    fs = require('fs'),
     path= require('path');

const results = [], habitablePlanet = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true
        }))
        .on('data', (data) => {
            if (isHabitablePlanet(data)) {
                habitablePlanet.push(data)
            }
            // results.push(data)
        })
        .on('error', (err) => {
            console.log(err)
            reject(err)
        })
        .on('end', () => {
            console.log(habitablePlanet.map((planet) => {
                return planet['kepler_name']
            }))
            console.log('the number of habitable planet are', habitablePlanet.length)
            console.log('all done')
            resolve()
        })
       
    })
}

module.exports = {
    planets: habitablePlanet,
    loadPlanetsData
}
