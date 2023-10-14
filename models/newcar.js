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
        username:{
            type:String,
            trim:true,
            maxlength:20,
            minlength:3
        }
    },
    descr:{
        type:String,
        trim:true,
        maxlength:100,
        minlength:1
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
},{
    timestamps:true
});

module.exports = mongoose.model("Car",carSchema);
