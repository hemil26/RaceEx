var express=require("express");
var router = express.Router();
var User=require("../models/user");
var passport=require("passport");
var async = require("async");
require('dotenv').config();
var nodemailer = require("nodemailer");
var crypto = require("crypto");

router.get('/',function(req,res){
    res.render("cars/home");
});

//==============
//AUTH ROUTES
//==============

router.get('/register',function(req,res){
    res.render('register');
});

router.post('/register',function(req, res) {
    var newUser = new User({username:req.body.username, email:req.body.email});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,function(){
            req.flash("success","Welcome to RaceEx "+user.username);
            res.redirect('/cars');
        });
    });
});

//SHOW LOGIN FORM
router.get('/login',function(req, res) {
    res.render('login');
});

//login logic
router.post('/login',passport.authenticate('local',
    {
        successRedirect:'/cars',
        failureRedirect:'/login'
    }),function(req, res) {
    res.redirect('/cars');
});

//LOGOUT ROUTE
router.get('/logout',function(req, res) {
    req.logout();
    req.flash("success","You are logged out !");
    res.redirect('/cars');
});

// FORGOT ROUTE
router.get('/forgot',function(req, res) {
    res.render('forgot');
});

//FORGOT POST ROUTE
router.post('/forgot',function(req,res,next){
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
            });
        },
        function(token,done){
            User.findOne({email:req.body.email},function(err,user){
                if(err){
                    req.flash("error","Something wrong occured!");
                }else if(!user){
                    req.flash("error","The user does not exist");
                    return res.redirect("back");
                }
                
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                
                user.save(function(err) {
                  done(err, token, user);
                });
            });
        },
        // SENDING THE MAIL TO USER
        function(token,user,done){
            var smtpTransport = nodemailer.createTransport({
                service:"Gmail",
                auth:{
                    user:'hemilmehta26@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            
            var mailOptions = {
                to: user.email,
                from: 'hemilmehta26@gmail.com',
                subject: 'RaceEx Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'https://' + req.headers.host + '/reset/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions,function(err){
                if(err){
                    console.log(err);
                    req.flash("error","Due to some error we couldn't send the mail");
                }else{
                    console.log("mail sent");
                    req.flash("success","An e-mail has been sent to " + user.email + " with further instructions.");
                    done(err, 'done');
                }
            });
        }
    ] ,function(err){
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

//RESET ROUTE

router.get('/reset/:token',function(req, res) {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires:{ $gt: Date.now() } },function(err,user){
        if(err){
            console.log(err);
            req.flash("error","Sorry! Something wrong occured ");
            return res.redirect("back");
        }else if(!user){
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }else{
            res.render('reset', {token: req.params.token});
        }
    });
});

// ENTERING THE NEW PASSWORD
router.post('/reset/:token',function(req, res) {
    async.waterfall([
        function(done){
            User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires:{ $gt: Date.now() } },function(err,user){
                if(err){
                    console.log(err);
                    req.flash("error","Sorry! Something wrong occured ");
                    return res.redirect("back");
                }else if(!user){
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('/forgot');
                }if(req.body.password === req.body.confirm){
                    user.setPassword(req.body.password,function(err){
                        if(err){
                            req.flash("error","Some error occured!");
                        }else{
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;
                            
                            user.save(function(err){
                                if(err){
                                    console.log(err)
                                }else{
                                    req.logIn(user,function(err){
                                    done(err, user);
                                });
                                }
                            })
                        }
                    });
                }else{
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },function(user,done){
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                  user: 'hemilmehta26@gmail.com',
                  pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'hemilmehta26@mail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                  'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ],function(err){
        if(err){
            res.redirect('/campgrounds');
            req.flash("error","Sorry! some error occured");
        }
    });
});

module.exports=router;