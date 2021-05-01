const express = require("express")
const mongoose = require("mongoose")
const app = express()
const path = require("path")
const Campground = require("./models/campground")



mongoose.connect('mongodb://localhost:27017/yelpcamp_v2',{useNewUrlParser: true, useUnifiedTopology : true ,useCreateIndex:true});
const db = mongoose.connection;

db.on("error",console.error.bind(console,"connection error : "))

db.once("open",function(req,res){
    console.log("database connected")
})

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({urlencoded:true,extended : true}))

app.get("/",function(req,res){
    res.render("home")
})

app.get("/campgrounds/",async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index.ejs",{campgrounds})
})

app.get("/campgrounds/new", (req,res) => {
    res.render("campgrounds/new")
})

app.post("/campgrounds",async (req,res) => {
    const campground = new Campground(req.body.campground);
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get("/campgrounds/:id",async(req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show",{campground})
})

app.listen(3000,function(req,res){
    console.log("server started");
})
