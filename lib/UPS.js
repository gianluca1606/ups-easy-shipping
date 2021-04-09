const autoBind = require("auto-bind");
const createAdressValidation = require("./AddressValidation");
const createShipConfirm = require("./shipConfirm");
const createShipAccept = require("./shipAccept");
const createVoidShipment = require("./voidShipment");
const createTimeInTransit = require("./timeInTransit");
const createRating = require("./rating");
const createTracking = require("./tracking");

class UPS {
  constructor(licenseId, userId, password, sandbox, useJSON) {
    this.licenseId = licenseId;
    this.userId = userId;
    this.password = password;
    this.useJSON = useJSON;
    this.sandbox = sandbox;
    this.SANDBOX_API = "wwwcie.ups.com";
    this.LIVE_API = "onlinetools.ups.com";
    autoBind(this);
  }

  AdressValidationRequest = createAdressValidation();
  ShipConfirmRequest = createShipConfirm();
  ShipAcceptRequest = createShipAccept();
  VoidShipmentRequest = createVoidShipment();
  TimeInTransitRequest = createTimeInTransit();
  RatingRequest = createRating();
  TrackingRequest = createTracking();
}

module.exports = UPS;
