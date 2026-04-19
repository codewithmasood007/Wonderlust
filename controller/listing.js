const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listing/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listing/new");
};

module.exports.createListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Listing data not found");
  }

  // 1. Get Image details
  let url = req.file.path;
  let filename = req.file.filename;

  // 2. Fix the Location Source (It comes from the form body, not the file)
  let locationQuery = req.body.listing.location;

  // 3. Geocoding logic
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&limit=1`,
      {
        headers: { "User-Agent": "Wanderlust_Project_App" }
      }
    );
    const data = await response.json();

    // Handle invalid locations
    if (!data || data.length === 0) {
      req.flash("error", "Could not find that location on the map. Please be more specific!");
      return res.redirect("/listings/new");
    }

    // 4. Create the new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // 5. Store Coordinates as NUMBERS [Longitude, Latitude]
    // In your controller:
newListing.geometry = {
    type: "Point",
    coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
};

    await newListing.save();
    req.flash("success", "New listing added successfully!");
    res.redirect("/listings");

  } catch (err) {
    console.error("Geocoding Error:", err);
    req.flash("error", "Geocoding service failed. Please try again later.");
    res.redirect("/listings/new");
  }
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The listing you requested does not exist!");
    return res.redirect("/listings");
  }
  // console.log(listing);
  res.render("./listing/show", { listing ,mapToken: process.env.MAP_TOKEN});
};

module.exports.editListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you requested for edit does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl = listing.image.url.replace(
    "/upload/",
    "/upload/h_300,w_250,q_auto,f_auto/",
  );
  res.render("./listing/edit", { listing, originalImageUrl });
};

module.exports.updateListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing is updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListings = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing is deleted!");
  res.redirect("/listings");
};
