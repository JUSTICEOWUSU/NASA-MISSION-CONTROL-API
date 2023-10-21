const { model,Schema } = require("mongoose");

const planetsSchema = new Schema({
    keplerName:{
        type:String,
        required:true
    }
});

module.exports = model("planet",planetsSchema);