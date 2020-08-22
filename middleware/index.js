var Car=require("../models/newcar");
var Comment = require("../models/comments");

// ALL THE MIDDLEWARE GOES HERE
var middlewareObj={
};

middlewareObj.checkUserOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Car.findById(req.params.id,function(err,foundCar){
            if(err){
                req.flash("error","Data not found!")
                console.log(err);
                res.redirect('back');
            }else{
                if(foundCar.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that ");
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash("error","You need to be signed in !")
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                console.log(err);
                res.redirect('back');
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that ");
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash("error","You need to be signed in !");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error',"You must be signed in to do that!");
    res.redirect('/login');
};

module.exports=middlewareObj;