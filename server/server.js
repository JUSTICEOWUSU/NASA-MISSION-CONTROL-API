const http = require("http");

const {connectToMondoDb} = require("./src/utilities/mongoUtils")


const app = require("./app")

const {loadPlanets} = require("./src/models/planet.model");
const {populateLaunchData} = require("./src/models/launch.model")
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    try {
        await connectToMondoDb();
        await loadPlanets();
        await populateLaunchData();
        server.listen(PORT, () => {
            console.log(`Listening to port: ${PORT}`);
        })} catch (error) {
    console.log("An error occurred" + error.message)
    }
    };


startServer();