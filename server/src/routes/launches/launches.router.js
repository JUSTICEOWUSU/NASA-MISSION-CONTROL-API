const express = require("express");
const {httpGetLaunch,httpPostLaunch,httpAbortLaunch} = require("./launches.controller");

const launchRouter = express.Router();

launchRouter.get("/",httpGetLaunch);
launchRouter.post("/",httpPostLaunch);
launchRouter.delete("/:id",httpAbortLaunch);

module.exports = launchRouter