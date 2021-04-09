const https = require("https");
const buildAccesRequest = require("../utils/accesRequest");

//Make a AdressValidation request
createAdressValidation = function () {
  return function AdressValidationRequest(options) {
    settings = this;
    return new Promise(function (resolve, reject) {
      //set account credentials
      try {
        const req = https.request({
          host: settings.sandbox ? settings.SANDBOX_API : settings.LIVE_API,
          path: "/ups.app/xml/AV",
          method: "POST",
        });

        /* build the request data for address validation and write it to
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
              var parseString = require("xml2js").parseString;
              parseString(responseData, function (err, result) {
                if (err) reject(err.message);
                if (result.AddressValidationResponse.Response[0].Error) {
                  reject(result.AddressValidationResponse.Response[0].Error[0]);
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
          resolve("Request Error: " + e.message);
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

    if (settings.licenseId && settings.userId && settings.password) {
      XMLrequest += buildAccesRequest(
        settings.licenseId,
        settings.userId,
        settings.password
      );
    } else {
      reject("Credentials missing");
    }

    XMLrequest += "<?xml version='1.0' encoding='UTF-8'?>";
    XMLrequest += "<AddressValidationRequest xml:lang='en-US'>";
    XMLrequest += "<Request>";
    XMLrequest += "<TransactionReference>";

    if (!data.customerContext) reject("Missing customer context");

    XMLrequest += "<CustomerContext>" + data.customerContext + "</CustomerContext>";

    XMLrequest += "<XpciVersion>1.0001</XpciVersion>";
    XMLrequest += "</TransactionReference>";
    XMLrequest += "<RequestAction>AV</RequestAction>";
    XMLrequest += "</Request>";
    XMLrequest += "<Address>";

    if (!data.city) reject("Missing City");
    XMLrequest += "<City>" + data.city + "</City>";

    if (!data.stateProvinceCode) reject("Missing State Province Code");
    XMLrequest += "<StateProvinceCode>" + data.stateProvinceCode + "</StateProvinceCode>";

    XMLrequest += "</Address>";
    XMLrequest += "</AddressValidationRequest>";

    return { body: XMLrequest };
  }
};
module.exports = createAdressValidation;
