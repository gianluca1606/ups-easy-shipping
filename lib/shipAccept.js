const https = require("https");

const SANDBOX_API = "wwwcie.ups.com";
const LIVE_API = "onlinetools.ups.com";

let USE_JSON = false;

/**
 * ShipAccept API Constructor
 * Pass your UPS licenseID, userID and Password as String
 *
 * @constructor
 */

const ShipAccept = function (licenseId, userId, password) {
  this.licenseId = licenseId;
  this.userId = userId;
  this.password = password;

  this.sandbox = true;
};

//Use UPS sandbox
ShipAccept.prototype.useSandbox = function (bool) {
  this.sandbox = bool == true;
};

ShipAccept.prototype.setJsonResponse = function (bool) {
  USE_JSON = bool == true;
};

//Make a shipAccept request
ShipAccept.prototype.makeRequest = function (options) {
  //set account credentials
  options["licenseId"] = this.licenseId;
  options["userId"] = this.userId;
  options["password"] = this.password;
  sandbox = this.sandbox;

  return new Promise(function (resolve, reject) {
    try {
      const req = https.request({
        host: this.sandbox ? SANDBOX_API : LIVE_API,
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
          if (USE_JSON) {
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

function buildRequestData(data, reject) {
  let response = "";

  response += "<?xml version='1.0' encoding='utf-8'?>";
  response += "<AccessRequest xml:lang='en-US'>";

  response += "<AccessLicenseNumber>" + data.licenseId + "</AccessLicenseNumber>";
  response += "<UserId>" + data.userId + "</UserId>";
  response += "<Password>" + data.password + "</Password>";
  response += "</AccessRequest>";

  response += "<ShipmentAcceptRequest>";
  response += "<Request>";
  response += "<RequestAction>";
  response += "ShipAccept";
  response += "</RequestAction>";
  response += "</Request>";
  response += "<ShipmentDigest>";

  if (!data.digest) reject("Missing digest");
  response += data.digest;

  response += "</ShipmentDigest>";
  response += "</ShipmentAcceptRequest>";

  return { body: response };
}

module.exports = ShipAccept;
