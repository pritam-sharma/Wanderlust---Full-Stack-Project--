const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
//const review = require("../models/review.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  saveRedirectUrl,
} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn,
  saveRedirectUrl,
  validateListing,

  wrapAsync(listingController.createListing)
);

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
