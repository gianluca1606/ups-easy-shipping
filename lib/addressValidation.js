const https = require("https");

const SANDBOX_API = "wwwcie.ups.com";
const LIVE_API = "onlinetools.ups.com";

let USE_JSON = false;

/**
 * AdressValidation Constructor
 * Pass your ups licenseID, userID and Password as String
 *
 * @constructor
 */
const AddressValidation = function (licenseId, userId, password) {
  this.licenseId = licenseId;
  this.userId = userId;
  this.password = password;

  this.sandbox = true;
};

//Use UPS sandbox
AddressValidation.prototype.useSandbox = function (bool) {
  this.sandbox = bool == true;
};

AddressValidation.prototype.setJsonResponse = function (bool) {
  USE_JSON = bool == true;
};

//Make a shipAccept request
AddressValidation.prototype.makeRequest = function (options) {
  options["licenseId"] = this.licenseId;
  options["userId"] = this.userId;
  options["password"] = this.password;
  sandbox = this.sandbox;

  return new Promise(function (resolve, reject) {
    //set account credentials
    try {
      const req = https.request({
        host: this.sandbox ? SANDBOX_API : LIVE_API,
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
          if (USE_JSON) {
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
  let response = "";

  response += "<?xml version='1.0' encoding='utf-8'?>";
  response += "<AccessRequest xml:lang='en-US'>";
  if (data.licenseId && data.userId && data.password) {
    response += "<AccessLicenseNumber>" + data.licenseId + "</AccessLicenseNumber>";
    response += "<UserId>" + data.userId + "</UserId>";
    response += "<Password>" + data.password + "</Password>";
  } else {
    reject("Credentials missing");
  }

  response += "</AccessRequest>";

  response += "<?xml version='1.0' encoding='UTF-8'?>";
  response += "<AddressValidationRequest xml:lang='en-US'>";
  response += "<Request>";
  response += "<TransactionReference>";

  if (!data.customerContext) reject("Missing customer context");

  response += "<CustomerContext>" + data.customerContext + "</CustomerContext>";

  response += "<XpciVersion>1.0001</XpciVersion>";
  response += "</TransactionReference>";
  response += "<RequestAction>AV</RequestAction>";
  response += "</Request>";
  response += "<Address>";

  if (!data.city) reject("Missing City");
  response += "<City>" + data.city + "</City>";

  if (!data.stateProvinceCode) reject("Missing State Province Code");
  response += "<StateProvinceCode>" + data.stateProvinceCode + "</StateProvinceCode>";

  response += "</Address>";
  response += "</AddressValidationRequest>";

  return { body: response };
}

module.exports = AddressValidation;
