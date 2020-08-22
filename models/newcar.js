var mongoose = require("mongoose");

var carSchema = new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    descr:String,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

module.exports = mongoose.model("Car",carSchema);
