var express=require("express");
var router = express.Router();
var Car=require("../models/newcar");
var middleware = require("../middleware");

router.get('/cars',function(req,res){
    Car.find({},function(err, allCars){
        if(err){
            console.log(err);
        }else{
            res.render("cars/cars",{cars:allCars,currentUser:req.user});
        }
    });
});


router.post('/cars',middleware.isLoggedIn,function(req,res){
    var newCar=req.body.newCar;
    var price = req.body.price;
    var newImage=req.body.newImage;
    var descr = req.body.descr;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var newCar={name:newCar,price:price,image:newImage, descr: descr,author:author};
    Car.create(newCar,function(err , newlyCar){
        if(err){
            console.log(err);
        }else{
            res.redirect('/cars');
        }
    });
});

router.get('/cars/new',middleware.isLoggedIn,function(req, res) {
    res.render("cars/new");
});

router.get('/cars/:id',function(req, res) {
    Car.findById(req.params.id).populate("comments").exec(function(err, foundCar){
        if(err){
            console.log(err);
        }else{
            console.log(foundCar);
            res.render("cars/show",{car:foundCar,currentUser:req.user});
        }
    });
    req.params.id;
});

// EDIT CAMPGROUND

router.get('/cars/:id/edit',middleware.checkUserOwnership,function(req, res) {
    Car.findById(req.params.id,function(err,foundCar){
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('cars/edit',{car:foundCar});
        }
    });
});

// UPDATE CAMPGROUND

router.put('/cars/:id',middleware.checkUserOwnership,function(req,res){
    Car.findByIdAndUpdate(req.params.id,req.body.car,function(err,updatedCar){
        if(err){
            req.flash("error","Sorry ! some error occured Try Again !")
            console.log(err);
            res.redirect('/cars');
        }else{
            req.flash("success","Successfully updated your Car info !");
            res.redirect('/cars/'+req.params.id);
        }
    });
});

// DELETE CAMPGROUND

router.delete('/cars/:id',middleware.checkUserOwnership,function(req, res) {
    Car.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
            res.redirect('/');
        }else{
            req.flash("success","Deleted a car site!");
            res.redirect('/cars');
        }
    });
});


module.exports=router;