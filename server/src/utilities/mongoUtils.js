const { connect, connection, disconnect } = require("mongoose");
require('dotenv').config();

const Nasa_password = process.env.NASA_MONGO_PASSW
const url = `mongodb+srv://NASA:${Nasa_password}@clusternasa.shuex.mongodb.net/?retryWrites=true&w=majority`

connection.once("open",()=>{
    console.log("mongo database connected successfully");
});

connection.on("error",(err)=>{
    console.error(err);
});

async function connectToMondoDb(){
    await connect(url,{useUnifiedTopology: true})
}

async function disconnectMongo(){
    await disconnect();
}
module.exports = {
    disconnectMongo,
    connectToMondoDb
};