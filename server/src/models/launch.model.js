const axios = require("axios");

const dblaunch = require("./mongoLauchModel");
const planets = require("./mongoPlanetsModel");

const defaultFlightNumber = 0;

async function latestFlightNumber() {
    const dflightNumber = await dblaunch
        .findOne()
        .sort("-flightNumber");

    if (!dflightNumber) return defaultFlightNumber;

    return dflightNumber.flightNumber;
}

async function checkLaunchExist(finding) {
    return await dblaunch.findOne(finding);
}

const spaceX_Api_Url = "https://api.spacexdata.com/v5/launches/query";

async function loadLaunchData() {
    const launchDataFromMongodb = await checkLaunchExist({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat"
    });
    if (launchDataFromMongodb) {
        console.log("launch data already loaded");
        return;
    }
    const responds = await axios.post(spaceX_Api_Url, {
        query: {},

        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },

                {
                    path: "payloads",
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    if (responds.status !== 200) {
        throw new Error("downloading launch data failed")
    }
    return responds.data.docs
}


// add launch to database
async function saveLaunch(new_launch) {
    try {
        await dblaunch.findOneAndUpdate({
            flightNumber: new_launch.flightNumber,
        }, new_launch, {
            upsert: true,
        })
    } catch (err) {
        console.error(err);
    }
}

// loading data from NASA api to mongo database
async function populateLaunchData() {
    const loadedLaunchData = await loadLaunchData();
    if (!loadedLaunchData) return;
    for (const launchData of loadedLaunchData) {
        const customers = launchData["payloads"].flatMap(payload => payload["customers"]);
        const launch = {
            flightNumber: launchData["flight_number"],
            upcoming: launchData["upcoming"],
            success: launchData["success"],
            launchDate: launchData["date_local"],
            mission: launchData["name"],
            rocket: launchData["rocket"]["name"],
            customers
        }
        saveLaunch(launch);
        console.log(`${launch.flightNumber} ${launch.mission}`);
    }
    return;
}

// launching a new rocket
async function addNewLaunch(data) {
    const planet = await planets.findOne({
        keplerName: data.target
    });

    if (!planet) throw new Error("planet was not found");
    const ltFlightNumber = await latestFlightNumber() + 1;

    const newLaunch = Object.assign(data, {
        customers: ["justice", "quabinah"],
        upcoming: "true",
        success: "true",
        launchDate: new Date(data.launchDate),
        flightNumber: ltFlightNumber
    });

    // saving launch
    await saveLaunch(newLaunch);
}

// aborting a launch
async function abortLaunch(id) {
    const aborted = await dblaunch.updateOne({
        flightNumber: id
    }, {
        success: false,
        upcoming: false
    });

    return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
    populateLaunchData,
    addNewLaunch,
    abortLaunch,
    checkLaunchExist
}