var express=require("express");
var app= express();
var bodyParser=require("body-parser");
var mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    passportLocal = require("passport-local"),
    passLocalMongoose = require("passport-local-mongoose"),
    methodOverride = require("method-override");
var Car = require("./models/newcar");
var User = require("./models/user");
var Comment = require("./models/comments");
var seedDB = require("./seeds");
require('dotenv').config();
var carRoutes = require("./routes/cars");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");



// seedDB();

//PASSWORD CONFIG

app.use(require("express-session")({
    secret:"waddup boi",
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(express.static(__dirname+"/public"));

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(authRoutes);
app.use(commentRoutes);
app.use(carRoutes);
    
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true, useUnifiedTopology:true});


app.listen(process.env.PORT,process.env.ID,function(){
    console.log("Server is running");
});