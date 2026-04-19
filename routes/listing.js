const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require('../controller/listing.js');

const {storage} = require("../cloudconfig.js");
const multer  = require('multer')
const upload = multer({storage})

// index & create route
router
.route("/")
.get(wrapAsync(listingController.index),
)
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)
);

// new route
router.get("/new", isLoggedIn,listingController.renderNewForm);

// show , update & delete routes
router
.route("/:id")
.get(
  wrapAsync(listingController.showListings),
)
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListings),
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListings),
);

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListings),
);


// app.get("/testListing",async (req,res)=>{
//     let sample = new Listing({
//         title:"your home!",
//         description:"for every mankind",
//         price:2170,
//         location:"gangtok",
//         country:"India"
//     });

//     await sample.save();
//     console.log(sample);
//     res.send("dat save sucessfully!");
// });

// handle expressError if page not exists

module.exports = router;
