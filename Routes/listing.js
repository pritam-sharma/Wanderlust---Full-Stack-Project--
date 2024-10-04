const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
//const review = require("../models/review.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
//index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
  })
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listing/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exits!");
      res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    //let {title,description,image,price,country,location} = req.body;
    const newListing = new Listing(req.body.listing);

    // if (!newListing.title) {
    //   throw new ExpressError(400, "Title is missing");
    // }
    // if (!newListing.description) {
    //   throw new ExpressError(400, "description is missing");
    // }
    // if (!newListing.location) {
    //   throw new ExpressError(400, "location is missing");
    // }
    //to replace above multiple if conditions we can use joi to validate server side schema
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exits!");
      res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing });
    res.redirect("/listings");
  })
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
// router.delete(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deleteListing = await Listing.findByIdAndDelete(id);
//     console.log(deleteListing);
//     res.redirect("/listings");
//   })
// );
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    // Attempt to find and delete the listing
    try {
      const deleteListing = await Listing.findByIdAndDelete(id);

      // Check if deleteListing is null (not found)
      if (!deleteListing) {
        console.log(`Listing with id ${id} not found`);
        return res.status(404).send("Listing not found"); // Send a 404 status if not found
      }

      console.log(`Deleted listing:`, deleteListing);

      // Redirect after successful deletion
      res.redirect("/listings");
    } catch (error) {
      console.error("Error deleting listing:", error);

      // Send a 500 status code for server errors
      res.status(500).send("Internal Server Error");
    }
  })
);

module.exports = router;
