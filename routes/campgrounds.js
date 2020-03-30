var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware")

//show all campgrounds
router.get("/",function(req,res){
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds});//no longer we are using array	
		}
	})
});

//add new campground to db
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newcampgrounds={name:name,price:price,description:description,image:image,author:author};
	
	
	//campgrounds.push(newcampgrounds);

	Campground.create(newcampgrounds,function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			console.log(newlycreated);
			req.flash("success","success!, campground added")
			res.redirect("/campgrounds")
		}
	})
	
});

//new form to create campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new")
});

//show info about campground
router.get("/:id",function(req,res){	//it should be below the above app.get
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show",{campground:foundCampground})
		}
	})
	
})

//EDIT CAMPGROUNDS ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground})
		})
})

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){         //YOU CAN UPDATE IF YOU HAVE CREATED CAMPGROUND
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updateCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" +req.params.id);
		}
	} )
})

//DESTROY/DELETE CAMPGROUND
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){  //YOU CAN DELETE IF YOU HAVE CREATED CAMPGROUND
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds")
		}else{
			req.flash("success","campground deleted succesfully!")
			res.redirect("/campgrounds");
		}
	})
})

//logged in chcking
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}



module.exports=router;