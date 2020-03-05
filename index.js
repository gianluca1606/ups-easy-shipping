var ShipConfirm = require('./lib/shipConfirm');
var ShipAccept = require('./lib/shipAccept');
var AddressValidation = require('./lib/AddressValidation');
var VoidShipment = require('./lib/voidShipment');
var TimeInTransit = require('./lib/timeInTransit');
var Rating = require('./lib/rating');
var Tracking = require('./lib/tracking');

module.exports = {
    ShipConfirm,
    ShipAccept,
    AddressValidation,
    VoidShipment,
    TimeInTransit,
    Rating,
    Tracking
}
