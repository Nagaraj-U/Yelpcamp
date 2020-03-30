var Campground=require("../models/campground")
var Comment=require("../models/comment")
var middlewareObj={};
middlewareObj.checkCampgroundOwnership=function checkCampgroundOwnership(req,res,next){    //ADD AS MIDDLEWARE IS UPDATE AND DELETE AND EDIT
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err,foundCampground){
                if(err){
                    //res.redirect("/campgrounds")
                    res.redirect("back")
                }else{
                    if(foundCampground.author.id.equals(req.user._id)){   //foundCampground IS COMING FROM FUNCTION
                        next();
                    }else{
                        req.flash("error","permission denied")
                        res.redirect("back")		//REDIRECTS YOU TO THE SAME PAGE
                    }
                }
            })
        }
        else{
            req.flash("error","you need to be logged in to do that!")
            res.redirect("back")
        }
    }
    



middlewareObj.checkCommentOwnership=function checkCommentOwnership(req,res,next){    //ADD AS MIDDLEWARE IS UPDATE AND DELETE AND EDIT
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err,foundComment){
			if(err){
				res.redirect("back ")
			}else{
				if(foundComment.author.id.equals(req.user._id)){   //foundCampground IS COMING FROM FUNCTION
					next();
				}else{
					res.redirect("back")		//REDIRECTS YOU TO THE SAME PAGE
				}
			}
		})
	}
	else{
		res.redirect("back")
	}
}

middlewareObj.isLoggedIn=function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
    }
    req.flash("error","you need to be logged in to do that!")
	res.redirect("/login");
}



module.exports=middlewareObj;