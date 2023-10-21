const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./mongoPlanetsModel");

// * save planet to database
async function savePlanets(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    });
  }
  catch (err) {
    console.error(`could't save planet: ${err}`);
  }

}

const planetsData = [];

// loading planets from csv file
const loadPlanets = () => {
  return new Promise((resolve, reject) => {
    const isHabitable = async (planet) => {
      if (
        planet["koi_disposition"] === "CONFIRMED" &&
        Number(planet["koi_insol"]) < 1.11 &&
        Number(planet["koi_insol"]) > 0.36 &&
        Number(planet["koi_prad"]) < 1.6
      ) {
        planetsData.push(planet);
        await savePlanets(planet);
      }
    };

    fs.createReadStream(path.join(__dirname, "kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (chunk) => {
        await isHabitable(chunk);
      })
      .on("error", (Error) => {
        reject(Error);
      })
      .on("end", async () => {
        resolve();
        console.log(`${(await planets.find({})).length} planets found`);
      });
  });
}

module.exports = {
  loadPlanets
}