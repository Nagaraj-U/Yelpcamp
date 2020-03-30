var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var Campground=require("./models/campground");
var seedDB=require("./seeds");
var Comment=require("./models/comment");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var methodOverride=require("method-override");//npm install method-override --save
var flash=require("connect-flash")

//requiring routes
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");



mongoose.connect("mongodb://localhost:27017/yelp_campdb",{useNewUrlParser: true ,useUnifiedTopology: true});//remember
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs")//to use ejs files
app.use(express.static(__dirname + "/public"))  //to add css file main.css
app.use(methodOverride("_method"));
app.use(flash());

//seed the DB
//seedDB();

app.use(require("express-session")({
	secret: "once again wins the cutest dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) { done(null, user.id); }); 
passport.deserializeUser(function(id, done) { User.findById(id, function(err, user) { done(err, user); }); });



app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});	


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(3000,function(){
	console.log("server started");
});




















// var express=require("express");
// var app=express();
// var bodyparser=require("body-parser");
// var mongoose=require("mongoose");
// var Campground=require("./models/campground");
// var seedDB=require("./seeds");
// var Comment=require("./models/comment");
// var passport=require("passport");
// var LocalStrategy=require("passport-local");
// var User=require("./models/user");
// seedDB();

// //PASSPORT CONFIGURATION
// app.use(require("express-session")({
// 	secret: "once again wins the cutest dog",
// 	resave: false,
// 	saveUninitialized: false
// }));

// app.use(function(req,res,next){
// 	res.locals.currentUser=req.user;
// 	next();
// });	

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(function(user, done) { done(null, user.id); }); 
// passport.deserializeUser(function(id, done) { User.findById(id, function(err, user) { done(err, user); }); });



// mongoose.connect("mongodb://localhost:27017/yelp_campdb",{useNewUrlParser: true ,useUnifiedTopology: true});//remember
// app.use(bodyparser.urlencoded({extended:true}));
// app.set("view engine","ejs")//to use ejs files
// app.use(express.static(__dirname + "/public"))  //to add css file main.css
// //console.log(__dirname);
// //SCHEMA SETUP

// // Campground.create({
// // 	name:"Down hills",
// // 	image:"https://images.pexels.com/photos/2526025/pexels-photo-2526025.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
// // 	description:"its huge campground,with many waterfalls and valleys"
// // },function(err,campground){
// // 	if(err){
// // 		console.log("something went wrong");
// // 		console.log(err);
// // 	}else{
// // 		console.log("new campground created");
// // 		console.log(campground);
// // 	}
// // });

// 										//FOR PASSING USER TO SHOE LOGIN SIGNUP LOGOUT ONLY AT CERTAIN PAGES

// app.get("/",function(req,res){
// 	res.render("landing");
// });



// // var campgrounds=[
// // 		{ name:"alaska", avail:"free always",image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
// // 		{ name:"mississippi", avail:"free on weekends",image:"https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
// // 		{ name:"johansberg", avail:"free on saturdays",image:"https://images.pexels.com/photos/2526025/pexels-photo-2526025.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
// // 	{ name:"alaska", avail:"free always",image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
// // 		{ name:"mississippi", avail:"free on weekends",image:"https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
// // 		{ name:"johansberg", avail:"free on saturdays",image:"https://images.pexels.com/photos/2526025/pexels-photo-2526025.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"}
// // 		]
// //USE db.COLLECTION.drop() (TO REMOVE DB)
// //USE db.COLLECTION.FIND() (TO shoW DB)
// app.get("/campgrounds",function(req,res){
// 	Campground.find({},function(err,allcampgrounds){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.render("campgrounds/index",{campgrounds:allcampgrounds});//no longer we are using array	
// 		}
// 	})
// 	//res.render("campgrounds",{campgrounds:campgrounds});
	
// });

// app.post("/campgrounds",function(req,res){
// 	var name=req.body.name;
// 	var image=req.body.image;
// 	var description=req.body.description;
// 	var newcampgrounds={name:name,description:description,image:image}
// 	//campgrounds.push(newcampgrounds);

// 	Campground.create(newcampgrounds,function(err,newlycreated){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.redirect("/campgrounds")
// 		}
// 	})
	
// });

// app.get("/campgrounds/new",isLoggedIn,function(req,res){
// 	res.render("campgrounds/new")
// });

// app.get("/campgrounds/:id",function(req,res){	//it should be below the above app.get
// 	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log(foundCampground);
// 			res.render("campgrounds/show",{campground:foundCampground})
// 		}
// 	})
	
// })

// //========================================================//COMMENT ROUTES
// app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
// 	//find campground bu ID
// 	Campground.findById(req.params.id,function(err, campground){
// 		if(err){
// 			console.log(err);
// 		}
// 		else{
// 			res.render("comments/new",{campground: campground})
// 		}
// 	});
	
// })

// app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
// 	Campground.findById(req.params.id,function(err,campground){
// 		if(err){
// 			console.log(err);
// 			res.redirect("/campgrounds");
// 		}else{
// 			Comment.create(req.body.comment,function(err,comment){
// 				if(err){
// 					console.log(err);
// 				}else{
// 					campground.comments.push(comment);
// 					campground.save();
// 					res.redirect("/campgrounds/" + campground._id);
// 				}
// 			})
// 		}
// 	})
// })


// //auth routes
// app.get("/register",function(req,res){
// 	res.render("register");
// });

// app.post("/register",function(req,res){
// 	//res.send("signing in");
// 	var newUser=new User({username:req.body.username});
// 	User.register(newUser,req.body.password,function(err,user){
// 		if(err){
// 			console.log(err);
// 			return res.render("register");
// 		}
// 		passport.authenticate("local")(req,res,function(){
// 			res.redirect("/campgrounds");
// 		});
// 	});
// });

// app.get("/login",function(req,res){
// 	res.render("login");
// })

// app.post("/login",passport.authenticate("local",
// {
// 	successRedirect:"/campgrounds",
// 	failureRedirect:"/login"
// }),function(req,res){
// });

// app.get("/logout",function(req,res){
// 	req.logout();
// 	res.redirect("/campgrounds")
// });

// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// app.listen(3000,function(){
// 	console.log("server started");
// });