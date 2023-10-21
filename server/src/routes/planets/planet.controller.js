const planets = require("../../models/mongoPlanetsModel")
const httpGetPlanets = async (req,res)=>{
     return res.status(200)
    .json( await planets.find({},"-__id -__v"));
}

module.exports = httpGetPlanets