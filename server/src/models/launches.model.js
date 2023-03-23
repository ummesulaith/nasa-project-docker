const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')
const axios = require('axios')
const launches = new Map()
const DEFAULT_FLIGHT_NUMBER = 100
let latestFlightNumber = 100;

async function saveLaunch(launch) {

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,

    }, launch, { upsert: true })


}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId
    })
}

async function abortLaunchById(launchId) {
    let abortResult = await launchesDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false
    })
    return abortResult.modifiedCount === 1;
    // const aborted = launches.get(launchId)
    // aborted.upcoming = false
    // aborted.success = false
    // return aborted
}

async function getAllLaunches(skip,limit) {
    return await launchesDatabase.find({}, {
        '_id': 0, '__v': 0
    })
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit)
    
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

async function scheduleNewLaunch(launch) {
    let planet = await planets.findOne({
        keplerName: launch.target
    })
    if (!planet) {
        throw new Error('No matching planet found!!')
    }
    const newFlight = await getLatestFlightNuber()
    const newLaunch = Object.assign(launch, {
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
async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter)
}
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
    console.log('Downloading launch data ...')
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                }, {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })
    if (response.status !== 200) {
        console.log('There was an error', response)
        throw new Error('There was an error')
    }
    const launchDocs = response.data.docs
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        }
      
        await saveLaunch(launch)
    }
}

async function loadLaunchData() {
    const firstLaunc = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: "FalconSat",
    });
    if (firstLaunc) {
        console.log('Launch data exists')
    } else {
        await populateLaunches()
    }


}

module.exports = {
    launches,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    loadLaunchData
}