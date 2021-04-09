const https = require("https");

CreateTimeInTransit = function () {
  return function TimeInTransitRequest(options) {
    settings = this;
    return new Promise(function (resolve, reject) {
      try {
        const req = https.request({
          host: settings.sandbox ? settings.SANDBOX_API : settings.LIVE_API,
          path: "/ups.app/xml/TimeInTransit",
          method: "POST",
        });

        /* build the request data for Time in Transit and write it to
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
            if (settings.useJSON) {
              let parseString = require("xml2js").parseString;
              parseString(responseData, function (err, result) {
                if (err) reject(err.message);
                if (result.TimeInTransitResponse.Response[0].Error) {
                  reject(result.TimeInTransitResponse.Response[0].Error[0]);
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
    let XMLrequest = "";

    XMLrequest += "<?xml version='1.0' encoding='utf-8'?>";
    XMLrequest += "<AccessRequest xml:lang='en-US'>";

    if (settings.licenseId && settings.userId && settings.password) {
      XMLrequest += buildAccesRequest(
        settings.licenseId,
        settings.userId,
        settings.password
      );
    } else {
      reject("Credentials missing");
    }

    XMLrequest += "</AccessRequest>";

    XMLrequest += "<?xml version='1.0' encoding='utf-8'?>";
    XMLrequest += "<TimeInTransitRequest xml:lang='en-US'>";
    XMLrequest += "<Request>";
    XMLrequest += "<TransactionReference>";

    if (!data.customerContext) reject("Missing Customer Context");

    XMLrequest += "<CustomerContext>";
    XMLrequest += data.customerContext;
    XMLrequest += "</CustomerContext>";

    XMLrequest += "<XpciVersion>1.0002</XpciVersion>";

    XMLrequest += "</TransactionReference>";
    XMLrequest += "<RequestAction>TimeInTransit</RequestAction>";
    XMLrequest += "</Request>";

    XMLrequest += "<TransitFrom>";
    XMLrequest += "<AddressArtifactFormat>";

    if (!data.transitFrom) reject("Missing transitFrom");

    if (data.transitFrom.fromDivision3) {
      XMLrequest +=
        "<PoliticalDivision3>" + data.transitFrom.fromDivision3 + "</PoliticalDivision3>";
    }

    if (data.transitFrom.fromDivision2) {
      XMLrequest +=
        "<PoliticalDivision2>" + data.transitFrom.fromDivision2 + "</PoliticalDivision2>";
    }

    if (data.transitFrom.fromDivision1) {
      XMLrequest +=
        "<PoliticalDivision1>" + data.transitFrom.fromDivision1 + "</PoliticalDivision1>";
    }

    if (!data.transitFrom.fromCountry) reject("Missing Country");
    XMLrequest += "<Country>" + data.transitFrom.fromCountry + "</Country>";

    if (!data.transitFrom.fromCountryCode) reject("Missing Country Code");
    XMLrequest += "<CountryCode>" + data.transitFrom.fromCountryCode + "</CountryCode>";

    XMLrequest += "</AddressArtifactFormat>";
    XMLrequest += "</TransitFrom>";

    XMLrequest += "<TransitTo>";
    XMLrequest += "<AddressArtifactFormat>";

    if (!data.transitTo) reject("Missing transitTo");

    if (data.transitTo.fromDivision3) {
      XMLrequest +=
        "<PoliticalDivision3>" + data.transitTo.fromDivision3 + "</PoliticalDivision3>";
    }

    if (data.transitTo.fromDivision2) {
      XMLrequest +=
        "<PoliticalDivision2>" + data.transitTo.fromDivision2 + "</PoliticalDivision2>";
    }

    if (data.transitTo.fromDivision1) {
      XMLrequest +=
        "<PoliticalDivision1>" + data.transitTo.fromDivision1 + "</PoliticalDivision1>";
    }

    if (!data.transitTo.toCountryCode) reject("Missing country code");
    XMLrequest += "<CountryCode>" + data.transitTo.toCountryCode + "</CountryCode>";

    if (!data.transitTo.postCode) reject("Missing post code");
    XMLrequest +=
      "<PostcodePrimaryLow>" + data.transitTo.postCode + "</PostcodePrimaryLow>";

    if (data.transitTo.addressIndicator) {
      XMLrequest +=
        "<ResidentialAddressIndicator>" +
        data.transitTo.addressIndicator +
        "</ResidentialAddressIndicator>";
    }

    XMLrequest += "</AddressArtifactFormat>";
    XMLrequest += "</TransitTo>";

    if (!data.shipmentWeight) reject("Missing shipmentWeight");

    XMLrequest += "<ShipmentWeight>";
    XMLrequest += "<UnitOfMeasurement>";

    if (!data.shipmentWeight.code) reject("Missing shipmentWeight code");
    XMLrequest += "<Code>" + data.shipmentWeight.code + "</Code>";

    if (!data.shipmentWeight.description) reject("Missing shipmentWeight desc");
    XMLrequest += "<Description>" + data.shipmentWeight.description + "</Description>";
    XMLrequest += "</UnitOfMeasurement>";

    if (!data.shipmentWeight.weight) reject("Missing Shipment weight");
    XMLrequest += "<Weight>" + data.shipmentWeight.weight + "</Weight>";
    XMLrequest += "</ShipmentWeight>";

    if (!data.totalPackageShipment) reject("Missing totalPackageShipment");

    XMLrequest +=
      "<TotalPackagesInShipment>" +
      data.totalPackageShipment +
      "</TotalPackagesInShipment>";

    if (!data.invoiceLineTotal) reject("Missing invoiceLineTotal");

    XMLrequest += "<InvoiceLineTotal>";

    if (!data.invoiceLineTotal.currencyCode) reject("Missing currency Code");
    XMLrequest +=
      "<CurrencyCode>" + data.invoiceLineTotal.currencyCode + "</CurrencyCode>";

    if (!data.invoiceLineTotal.monetaryValue) reject("Missing monetary value");
    XMLrequest +=
      "<MonetaryValue>" + data.invoiceLineTotal.monetaryValue + "</MonetaryValue>";
    XMLrequest += "</InvoiceLineTotal>";

    if (!data.pickupDate) reject("Missing pick up date");
    XMLrequest += "<PickupDate>" + data.pickupDate + "</PickupDate>";
    XMLrequest += "<DocumentsOnlyIndicator />";
    XMLrequest += "</TimeInTransitRequest>";

    return { body: XMLrequest };
  }
};

module.exports = CreateTimeInTransit;
