const Listing = require('./models/listing');
const Review = require('./models/review.js');
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;

    req.session.save(() => {   // 🔥 FORCE SAVE
      req.flash("error", "you must be logged in!");
      res.redirect("/login");
    });

  } else {
    next();
  }
};

module.exports.isOwner = async(req,res,next)=>{
   let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","you are not owner of this listings!")
      return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
   let {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","you are not author of this listings!")
      return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};