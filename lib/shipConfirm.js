const https = require("https");

const SANDBOX_API = "wwwcie.ups.com";
const LIVE_API = "onlinetools.ups.com";

let USE_JSON = false;

/**
 * ShipConfirm API Constructor
 * Pass your UPS licenseID, userID and Password as String
 *
 * @constructor
 */
const ShipConfirm = function (licenseId, userId, password) {
  this.licenseId = licenseId;
  this.userId = userId;
  this.password = password;

  this.sandbox = true;
};

//Use UPS sandbox
ShipConfirm.prototype.useSandbox = function (bool) {
  this.sandbox = bool == true;
};

ShipConfirm.prototype.setJsonResponse = function (bool) {
  USE_JSON = bool == true;
};

//Make a shipconfirm request
ShipConfirm.prototype.makeRequest = function (options) {
  //set account credentials
  options["licenseId"] = this.licenseId;
  options["userId"] = this.userId;
  options["password"] = this.password;
  sandbox = this.sandbox;

  return new Promise(function (resolve, reject) {
    try {
      var req = https.request({
        host: this.sandbox ? SANDBOX_API : LIVE_API,
        path: "/ups.app/xml/ShipConfirm",
        method: "POST",
      });

      /* build the request data for shipConfirm and write it to
		the request body
	*/
      const { body } = buildRequestData(options, reject);

      req.write(body);

      req.on("response", function (res) {
        let responseData = "";

        res.on("data", function (data) {
          data = data.toString();
          responseData += data;
        });

        res.on("end", function () {
          if (USE_JSON) {
            let parseString = require("xml2js").parseString;
            parseString(responseData, function (err, result) {
              if (err) reject(err.message);
              if (result.ShipmentConfirmResponse.Response[0].Error) {
                reject(result.ShipmentConfirmResponse.Response[0].Error[0]);
              } else {
                resolve(result);
              }
            });
          } else {
            resolve(responseData);
          }
        });
      });

      req.on("error", (e) => {
        reject(e.message);
      });

      req.end();
    } catch (error) {
      reject(error.message);
    }
  });
};

function buildRequestData(data, reject) {
  let XMLrequest = "",
    insert;

  XMLrequest += "<?xml version='1.0' encoding='utf-8'?>";
  XMLrequest += "<AccessRequest xml:lang='en-US'>";

  XMLrequest += "<AccessLicenseNumber>" + data.licenseId + "</AccessLicenseNumber>";
  XMLrequest += "<UserId>" + data.userId + "</UserId>";
  XMLrequest += "<Password>" + data.password + "</Password>";

  XMLrequest += "</AccessRequest>";

  XMLrequest += "<ShipmentConfirmRequest>";
  XMLrequest += "<Request>";

  XMLrequest += "<RequestAction>";
  XMLrequest += "ShipConfirm";
  XMLrequest += "</RequestAction>";

  if (!data.validate) reject("Missing Validation type");

  XMLrequest += "<RequestOption>";
  XMLrequest += data.validate;
  XMLrequest += "</RequestOption>";

  XMLrequest += "</Request>";

  XMLrequest += "<Shipment>";
  if (!data.shipment) reject("Missing Shipment");

  if (data.shipment.description) {
    XMLrequest += "<Description>";
    XMLrequest += data.shipment.description;
    XMLrequest += "</Description>";
  }

  // TO DO: Add ReturnService

  if (!data.shipment.shipper) reject("Missing Shipper");
  let shipper = data.shipment.shipper;
  XMLrequest += "<Shipper>";

  XMLrequest += "<Name>";
  XMLrequest += shipper.name;
  XMLrequest += "</Name>";

  if (shipper.attentionName) {
    XMLrequest += "<AttentionName>";
    XMLrequest += shipper.attentionName;
    XMLrequest += "</AttentionName>";
  }

  XMLrequest += "<ShipperNumber>";
  XMLrequest += shipper.shipperNumber || "";
  XMLrequest += "</ShipperNumber>";

  if (shipper.phone) {
    XMLrequest += "<PhoneNumber>";
    XMLrequest += shipper.phone;
    XMLrequest += "</PhoneNumber>";
  }

  if (!shipper.address) reject("Missing Shipper Address");

  XMLrequest += buildAddress(shipper.address);

  XMLrequest += "</Shipper>";

  if (!data.shipment.shipTo) reject("Missing Ship To");
  let shipTo = data.shipment.shipTo;
  XMLrequest += "<ShipTo>";

  XMLrequest += "<CompanyName>";
  XMLrequest += shipTo.companyName;
  XMLrequest += "</CompanyName>";

  if (shipTo.attentionName) {
    XMLrequest += "<AttentionName>";
    XMLrequest += shipTo.attentionName;
    XMLrequest += "</AttentionName>";
  }

  if (shipTo.phone) {
    XMLrequest += "<PhoneNumber>";
    XMLrequest += shipTo.phone;
    XMLrequest += "</PhoneNumber>";
  }

  if (!shipTo.address) reject("Missing Ship To Address");

  XMLrequest += buildAddress(shipTo.address);

  XMLrequest += "</ShipTo>";

  if (data.shipment.shipFrom) {
    var shipFrom = data.shipment.shipFrom;
    XMLrequest += "<ShipFrom>";

    if (shipFrom.companyName) {
      XMLrequest += "<CompanyName>";
      XMLrequest += shipFrom.companyName;
      XMLrequest += "</CompanyName>";
    }

    if (shipFrom.attentionName) {
      XMLrequest += "<AttentionName>";
      XMLrequest += shipFrom.attentionName;
      XMLrequest += "</AttentionName>";
    }

    if (shipFrom.phone) {
      XMLrequest += "<PhoneNumber>";
      XMLrequest += shipFrom.phone;
      XMLrequest += "</PhoneNumber>";
    }

    XMLrequest += buildAddress(shipFrom.address);
    XMLrequest += "</ShipFrom>";
  }

  if (!data.shipment.payment) return reject("Missing Shipment Payment");
  let payment = data.shipment.payment;

  XMLrequest += "<PaymentInformation>";

  XMLrequest += "<Prepaid>";

  XMLrequest += "<BillShipper>";
  XMLrequest += "<AccountNumber>";
  XMLrequest += payment.accountNumber;
  XMLrequest += "</AccountNumber>";
  XMLrequest += "</BillShipper>";

  XMLrequest += "</Prepaid>";

  XMLrequest += "</PaymentInformation>";

  if (!data.shipment.service) reject("Missing Shipment Service");
  var service = data.shipment.service;
  XMLrequest += "<Service>";
  XMLrequest += "<Code>";
  var code;
  switch (service.code.toLowerCase()) {
    case "next day air":
      code = "01";
      break;
    case "2nd day air":
      code = "02";
      break;
    case "ground":
      code = "03";
      break;
    case "express":
      code = "07";
      break;
    case "expedited": //worldwide expidited
      code = "08";
      break;
    case "ups standard":
      code = "11";
      break;
    case "3 day select":
      code = "12";
      break;
    case "next day air saver":
      code = "13";
      break;
    case "next day air early am":
      code = "14";
      break;
    case "express plus":
      code = "54";
      break;
    case "2nd day air am":
      code = "59";
      break;
    case "ups saver": //ups express saver
      code = "65";
      break;
    case "first class mail":
      code = "M2";
      break;
    case "priority mail":
      code = "M3";
      break;
    case "expedited mail innovations":
      code = "M4";
      break;
    case "priority mail innovations":
      code = "M5";
      break;
    case "economy mail innovations":
      code = "M6";
      break;
    case "ups today standard":
      code = "82";
      break;
    case "ups today dedicated courier":
      code = "83";
      break;
    case "ups today intercity":
      code = "84";
      break;
    case "ups today express":
      code = "85";
      break;
    case "ups today express saver":
      code = "86";
      break;
    case "ups worldwide express fright":
      code = "96";
      break;
    default:
      return reject("Invalid service code");
      break;
  }
  XMLrequest += code;
  XMLrequest += "</Code>";
  XMLrequest += "</Service>";

  // TO DO: ShipmentServiceOptions (note: return label may come from here, pg 26?)
  XMLrequest += "<ShipmentServiceOptions>";

  if (data.shipment.confirmation) {
    XMLrequest += "<DeliveryConfirmation>";
    XMLrequest += "<DCISType>";
    XMLrequest += data.shipment.confirmation.type == "required" ? "1" : "2";
    XMLrequest += "</DCISType>";
    XMLrequest += "</DeliveryConfirmation>";
  }
  XMLrequest += "</ShipmentServiceOptions>";

  if (!data.shipment.package)
    return { success: false, error: "Missing Shipment Packages" };

  data.shipment.package.forEach(function (val) {
    XMLrequest += "<Package>";
    insert = buildPackageInternals(val);
    if (insert) {
      XMLrequest += insert;
    } else {
      reject("Bad Package Internals");
    }
    XMLrequest += "</Package>";
  });

  XMLrequest += "</Shipment>";

  //TODO: Add alternate label types;
  XMLrequest += "<LabelSpecification>";
  XMLrequest += "<LabelPrintMethod>";
  XMLrequest += "<Code>";
  XMLrequest += "ZPL";
  XMLrequest += "</Code>";
  XMLrequest += "</LabelPrintMethod>";

  XMLrequest += "<HTTPUserAgent>";
  XMLrequest += "Mozilla/4.5";
  XMLrequest += "</HTTPUserAgent>";

  XMLrequest += "<LabelImageFormat>";
  XMLrequest += "<Code>";
  XMLrequest += "ZPL";
  XMLrequest += "</Code>";
  XMLrequest += "</LabelImageFormat>";

  XMLrequest += "</LabelSpecification>";

  XMLrequest += "</ShipmentConfirmRequest>";

  return { body: XMLrequest };
}

const buildPackageInternals = function (val) {
  let response = "";

  if (val.description) {
    response += "<Description>";
    response += val.description;
    response += "</Description>";
  }

  response += "<PackagingType>";
  response += "<Code>";
  response += val.code || "02";
  response += "</Code>";
  response += "</PackagingType>";

  response += "<PackageWeight>";
  response += "<Weight>";
  response += val.weight || "1";
  response += "</Weight>";
  response += "</PackageWeight>";

  //TODO: Insurance
  if (val.insurance) {
    response += "<PackageServiceOptions>";
    response += "<InsuredValue>";
    response += buildInsurance(val.insurance);
    response += "</InsuredValue>";
    response += "</PackageServiceOptions>";
  }
  return response;
};

var buildInsurance = function (val) {
  var response = "";

  response += "<Type>";
  response += "<Code>";
  response += "01";
  response += "</Code>";
  response += "</Type>";

  response += "<CurrencyCode>";
  response += "USD";
  response += "</CurrencyCode>";

  response += "<MonetaryValue>";
  response += val.value;
  response += "</MonetaryValue>";

  return response;
};

const buildAddress = function (val) {
  let response = "";

  response += "<Address>";
  response += "<AddressLine1>";
  response += val.address1;
  response += "</AddressLine1>";

  response += "<AddressLine2>";
  response += val.address2 || "";
  response += "</AddressLine2>";

  response += "<AddressLine3>";
  response += val.address3 || "";
  response += "</AddressLine3>";

  response += "<City>";
  response += val.city;
  response += "</City>";

  response += "<StateProvinceCode>";
  response += val.state;
  response += "</StateProvinceCode>";

  response += "<PostalCode>";
  response += val.zip;
  response += "</PostalCode>";

  response += "<CountryCode>";
  response += val.country;
  response += "</CountryCode>";
  response += "</Address>";

  return response;
};

module.exports = ShipConfirm;
