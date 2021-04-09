const https = require("https");

createVoidShipment = function () {
  return function VoidShipmentRequest(options) {
    settings = this;
    return new Promise(function (resolve, reject) {
      try {
        const req = https.request({
          host: settings.sandbox ? settings.SANDBOX_API : settings.LIVE_API,
          path: "/ups.app/xml/Void",
          method: "POST",
        });

        /* build the request data for void shipment and write it to
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
                if (result.VoidShipmentResponse.Response[0].Error) {
                  reject(result.VoidShipmentResponse.Response[0].Error[0]);
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
    var XMLrequest = "";

    XMLrequest += "<?xml version='1.0' encoding='utf-8'?>";
    if (settings.licenseId && settings.userId && settings.password) {
      XMLrequest += buildAccesRequest(
        settings.licenseId,
        settings.userId,
        settings.password
      );
    } else {
      reject("Credentials missing");
    }

    XMLrequest += "<?xml version='1.0' encoding='utf-8'?>";
    XMLrequest += "<VoidShipmentRequest>";
    XMLrequest += "<Request>";

    XMLrequest += "<RequestAction>";
    XMLrequest += "1";
    XMLrequest += "</RequestAction>";

    XMLrequest += "</Request>";

    XMLrequest += "<ExpandedVoidShipment>";
    XMLrequest += "<ShipmentIdentificationNumber>";

    if (!data.tracking) reject("Missing tracking number");
    XMLrequest += data.tracking.toUpperCase();

    XMLrequest += "</ShipmentIdentificationNumber>";
    XMLrequest += "</ExpandedVoidShipment>";

    XMLrequest += "</VoidShipmentRequest>";
    return { body: XMLrequest };
  }
};

module.exports = createVoidShipment;
