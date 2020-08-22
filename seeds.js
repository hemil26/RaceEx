var mongoose = require("mongoose");
var Car = require("./models/newcar");
var Comment   = require("./models/comments");

var data = [
    {
        name: "Mercedes AMG F1 W11", 
        image: "https://cdn-1.motorsport.com/images/mgl/6b74QKn0/s8/valtteri-bottas-mercedes-amg-f-1.jpg",
        descr: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Red Bull Racing RB16", 
        image: "https://cdn-1.motorsport.com/images/mgl/0rG4rRy2/s8/max-verstappen-red-bull-racing-1.jpg",
        descr: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "AlphaTauri AT01", 
        image: "https://cdn-1.motorsport.com/images/mgl/2eA4QN12/s8/pierre-gasly-alphatauri-at01-1.jpg",
        descr: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
    Car.remove({},function(err){
        if(err){
            console.log(err);
        }
    });
}
module.exports = seedDB;