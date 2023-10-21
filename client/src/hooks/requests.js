const url = "/v1";
async function httpGetPlanets() {
  const res = await fetch(`${url}/planets`);
  return res.json();
}

async function httpGetLaunches() {
  const respond = await fetch(`${url}/launch`);
  const fetchedLaunches = await respond.json();
  return fetchedLaunches.sort((a,b)=>{
    return a.flightNumber-b.flightNumber;
  })

}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${url}/launch`,{
      method:"post",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify(launch),
  
    })
  } catch (error) {
    return {
      ok:false
    }
  }
  
}

async function httpAbortLaunch(id) {
  try{
    return fetch(`${url}/launch/${id}`,{
      method:"delete"
    })
  }catch(err){
    return{
      ok:false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};