const AddressValidation = require("./lib/AddressValidation");
const ShipConfirm = require("./lib/shipConfirm");
const ShipAccept = require("./lib/shipAccept");
const VoidShipment = require("./lib/voidShipment");
const TimeInTransit = require("./lib/timeInTransit");
const Rating = require("./lib/rating");
const Tracking = require("./lib/tracking");

module.exports = {
  ShipConfirm,
  ShipAccept,
  AddressValidation,
  VoidShipment,
  TimeInTransit,
  Rating,
  Tracking,
};
