const express = require("express");

const planetRouter = require("../planets/planet.route");
const launchRouter = require("../launches/launches.router");

const v1Api = express.Router();

v1Api.use("/planets",planetRouter);
v1Api.use("/launch",launchRouter);

module.exports = v1Api;