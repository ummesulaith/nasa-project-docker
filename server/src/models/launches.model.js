const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const launches = new Map()
const DEFAULT_FLIGHT_NUMBER = 100
let latestFlightNumber = 100;
const launch = {
    flightNumber: 100,
    mission: 'Kepler',
    rocket: 'exploere',
    launchDate: new Date('Dec 27,2030'),
    target: 'Kepler-442 b',
    customer: ['nasa', 'ztm'],
    upcoming: true,
    success: true,

}
saveLaunch(launch)
// launches.set(launch.flightNumber,launch)
async function saveLaunch(launch) {
    let planet = await planets.findOne({
        keplerName: launch.target
    })
    if (!planet) {
        throw new Error('No matching planet found!!')
    } else {
        await launchesDatabase.findOneAndUpdate({
            flightNumber: launch.flightNumber,

        }, launch, { upsert: true })
    }

}

async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber:launchId
    })
    //launches.has(launchId)
}

async function abortLaunchById(launchId) {
   let abortResult= await launchesDatabase.updateOne({
        flightNumber:launchId,
    },{
        upcoming:false,
        success: false
    })
    return abortResult.modifiedCount === 1;
    // const aborted = launches.get(launchId)
    // aborted.upcoming = false
    // aborted.success = false
    // return aborted
}

async function getAllLaunches() {
    return await launchesDatabase.find({}, {
        '_id': 0, '__v': 0
    })
}

// function addNewLanch(launch) {
//     latestFlightNumber++
//     launches.set(latestFlightNumber, Object.assign(launch, {
//         success: true,
//         upcoming: true,
//         customers: ['ZTM', 'NASA'],
//         flightNumber: latestFlightNumber
//     }))

// }

async function scheduleNewLaunch(launch){
    const newFlight = await getLatestFlightNuber() 
const newLaunch = Object.assign(launch,{
    success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlight + 1
})
await saveLaunch(newLaunch)
}

async function getLatestFlightNuber() {
    const latestLaunch = await launchesDatabase.findOne({})
        .sort('-flightNumber')
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber
}
module.exports = {
    launches,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}