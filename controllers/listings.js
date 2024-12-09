const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listing/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exits!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listing/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  //let {title,description,image,price,country,location} = req.body;
  const newListing = new Listing(req.body.listing);
  console.log(newListing);

  newListing.owner = req.user._id;

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
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exits!");
    res.redirect("/listings");
  }
  res.render("listing/edit.ejs", { listing });
  res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
