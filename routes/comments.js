var express=require("express");
var router = express.Router();
var Car=require("../models/newcar");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//COMMENT ROUTES
router.get('/cars/:id/comments/new',middleware.isLoggedIn,function(req, res) {
    Car.findById(req.params.id,function(err,car_info){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{car:car_info,currentUser:req.user});
        }
    });
});

router.post('/cars/:id/comments',middleware.isLoggedIn,function(req,res){
    Car.findById(req.params.id,function(err, car) {
        if(err){
            console.log(err)
            res.redirect('/cars');
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong Try Again !")
                    console.log(err);
                }else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save comment
                    comment.save();
                    car.comments.push(comment);
                    car.save();
                    res.redirect('/cars/'+car._id);
                }
            });
        }
    });
});

router.get('/aboutus',function(req, res) {
    res.render('cars/aboutus');
});

// COMMENT EDIT ROUTE

router.get('/cars/:id/comments/:comment_id/edit',middleware.checkCommentOwnership,function(req, res) {
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect('back');
        }else{
            res.render('comments/edit',{car_id:req.params.id , comment:foundComment});
        }
    });
});

//COMMENT EDIT PUT

router.put('/cars/:id/comments/:comment_id',middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/cars/'+req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE

router.delete('/cars/:id/comments/:comment_id',middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.flash("success","Comment deleted")
            res.redirect('/cars/'+req.params.id);
        }
    });
});

module.exports=router;