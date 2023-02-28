const API_URL = 'http://localhost:8000'

async function httpGetPlanets() {
 const response = await fetch(`${API_URL}/planets`)
  return await response.json()
}

async function httpGetLaunches() {
  try {
    const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
  } catch (error) {
    console.log('errorin upcoming or get launches',error)
  }
  
}

async function httpSubmitLaunch(launch) {
 
  try {
    return fetch(`${API_URL}/launches`,{
      method:'post',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(launch)
    })
    
  } catch (error) {
    return{
      ok: false
    }
  }
  
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    return await fetch(`${API_URL}/launches/${id}`,{
      method:'delete'
    })
  } catch (error) {
    console.log(error)
    return{
      ok: false
    }
  }
 
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};