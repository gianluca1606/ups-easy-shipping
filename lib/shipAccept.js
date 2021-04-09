const https = require("https");

createShipAccept = function () {
  return function ShipAcceptRequest(options) {
    settings = this;
    return new Promise(function (resolve, reject) {
      try {
        const req = https.request({
          host: settings.sandbox ? settings.SANDBOX_API : settings.LIVE_API,
          path: "/ups.app/xml/ShipAccept",
          method: "POST",
        });

        /* build the request data for ship accept and write it to
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
                console.log(responseData);
                if (err) reject(err.message);

                if (result.ShipmentAcceptResponse.Response[0].Error) {
                  reject(result.ShipmentAcceptResponse.Response[0].Error[0]);
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

  XMLrequest += "<ShipmentAcceptRequest>";
  XMLrequest += "<Request>";
  XMLrequest += "<RequestAction>";
  XMLrequest += "ShipAccept";
  XMLrequest += "</RequestAction>";
  XMLrequest += "</Request>";
  XMLrequest += "<ShipmentDigest>";

  if (!data.digest) reject("Missing digest");
  XMLrequest += data.digest;

  XMLrequest += "</ShipmentDigest>";
  XMLrequest += "</ShipmentAcceptRequest>";

  return { body: XMLrequest };
}

module.exports = createShipAccept;
