var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

//root route
router.get("/",function(req,res){
	res.render("landing");
});



//register route show register form
router.get("/register",function(req,res){
	res.render("register");
});

//handle signup logic
router.post("/register",function(req,res){
	//res.send("signing in");
	//var newUser=new User({username:req.body.username});
	User.register({username:req.body.username},req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message)
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","welcome to yelpcamp! " +user.username)
			res.redirect("/campgrounds");
		});
	});
});

//login form
router.get("/login",function(req,res){
	res.render("login");
})

//hangle sign in logic
router.post("/login",passport.authenticate("local",
{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
});

//logout route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","logged you out!")
	res.redirect("/campgrounds")
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","please login first")
	res.redirect("/login");
}

module.exports=router;