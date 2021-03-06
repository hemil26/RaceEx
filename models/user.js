var mongoose =require("mongoose");
var passLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    password:String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.plugin(passLocalMongoose); 

module.exports = mongoose.model("User",userSchema);