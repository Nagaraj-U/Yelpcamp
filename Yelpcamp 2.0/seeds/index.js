//seeding database  : initializing database with some dummy values

const mongoose = require("mongoose")
const Campground = require("../models/campground")

mongoose.connect('mongodb://localhost:27017/yelpcamp_v2',{useNewUrlParser: true, useUnifiedTopology : true ,useCreateIndex:true});
const db = mongoose.connection;

db.on("error",console.error.bind(console,"connection error : "))

db.once("open",function(req,res){
    console.log("database connected")
})

const cities = require("./cities")
const {descriptors,places} = require("./seedHelpers")

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const randCity = Math.floor(Math.random() * 1000); // to generate random locations
        const randDesc = Math.floor(Math.random() * 17) //to generate random descriptions
        const camp = new Campground({location : `${cities[randCity].city} , ${cities[randCity].state}` , 
                                     title : `${descriptors[randDesc]} ${places[randDesc]}`})
        await camp.save();
    }
    
}

seedDB()


