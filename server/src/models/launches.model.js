const launches = new Map()

let latestFlightNumber = 100;
const launch = {
    flightNumber: 100,
    mission: 'Kepler',
    rocket: 'exploere',
    launchDate: new Date('Dec 27,2030'),
    target: 'kepler 442 b',
    customer: ['nasa','ztm'],
    upcoming: true,
    success: true,
    
}

launches.set(launch.flightNumber,launch)

function existsLaunchWithId(launchId){
    return launches.has(launchId)
}

function abortLaunchById(launchId){
 const aborted =  launches.get(launchId)
 aborted.upcoming = false
 aborted.success = false  
 return aborted
}

function getAllLaunches(){
    return Array.from(launches.values())
}

function addNewLanch(launch){
    latestFlightNumber++
    launches.set(latestFlightNumber,Object.assign(launch,{
        success: true,
      upcoming: true,
        customers:['ZTM','NASA'],
        flightNumber: latestFlightNumber
    }))

}

module.exports={
    launches,
    getAllLaunches,
    addNewLanch,
    existsLaunchWithId,
    abortLaunchById
}