const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String
  },
  price:Number,
  location: String,
  country: String,
  reviews: [
  {
    type: Schema.Types.ObjectId,
    ref: "Review"
  }
],
geometry: {
    type: {
      type: String, 
      enum: ['Point'], // 'geometry.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
owner:{
   type: Schema.Types.ObjectId,
    ref: "User"
},

});

listingSchema.index({ geometry: "2dsphere" });

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
await Review.deleteMany({
  _id: { $in: listing.reviews }
});  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;