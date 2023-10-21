const express = require("express");
const httpGetPlanets = require("./planet.controller")
const planetRouter = express.Router();

planetRouter.get("/",httpGetPlanets);

module.exports = planetRouter;