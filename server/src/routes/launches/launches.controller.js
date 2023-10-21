const { addNewLaunch, abortLaunch, checkLaunchExist } = require("../../models/launch.model");
const dblaunch = require("./../../models/mongoLauchModel");
const paginateResponds = require("./../../utilities/paginationUtils")

async function httpGetLaunch(req, res) {
    const query = req.query;
    const {skip,limit} = paginateResponds(query)
    return res
        .status(200)
        .json(await dblaunch
            .find({}, "-__v -_id")
            .sort({flightNumber:1})
            .skip(skip)
            .limit(limit)
            )
}

async function httpPostLaunch(req, res) {
    const launch = req.body

    if (!launch["mission"] || !launch["rocket"] || !launch["target"] || !launch["launchDate"]) {
        return res
            .status(400)
            .json({
                error: "Missing Launch Property"
            });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res
            .status(400)
            .json({
                error: "Invalid Date"
            });
    }

    await addNewLaunch(launch);

    return res
        .status(201)
        .json(launch);

}

async function httpAbortLaunch(req, res) {
    const id = +req.params.id;
    const finding = {flightNumber:id}
    const check = await checkLaunchExist(finding)

    if (check) {
        const aborted = await abortLaunch(id)

        if (!aborted) {
            return res
                .status(400)
                .json({ error: "could not abort" });
        }

        return res
            .status(200)
            .json({
                ok: true
            });
    } else {
        return res
            .status(404)
            .json({
                error: "404 not found"
            });
    }

}

module.exports = {
    httpGetLaunch,
    httpPostLaunch,
    httpAbortLaunch
}

