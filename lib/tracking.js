const https = require("https");
const SANDBOX_API = "wwwcie.ups.com";
const LIVE_API = "onlinetools.ups.com";

let USE_JSON = false;

const Tracking = function (licenseId, userId, password) {
  this.licenseId = licenseId;
  this.userId = userId;
  this.password = password;

  this.sandbox = true;
};

//Use UPS sandbox
Tracking.prototype.useSandbox = function (bool) {
  this.sandbox = bool == true;
};

Tracking.prototype.setJsonResponse = function (bool) {
  USE_JSON = bool == true;
};

//Make a tracking request
Tracking.prototype.makeRequest = function (options, callback) {
  //set account credentials
  options["licenseId"] = this.licenseId;
  options["userId"] = this.userId;
  options["password"] = this.password;
  sandbox = this.sandbox;

  return new Promise(function (resolve, reject) {
    try {
      const req = https.request({
        host: this.sandbox ? SANDBOX_API : LIVE_API,
        path: "/ups.app/xml/Track",
        method: "POST",
      });

      /* build the request data for tracking and write it to
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
              if (result.TrackResponse.Response[0].Error) {
                reject(result.TrackResponse.Response[0].Error[0]);
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
  XMLrequest += "<AccessLicenseNumber>" + data.licenseId + "</AccessLicenseNumber>";
  XMLrequest += "<UserId>" + data.userId + "</UserId>";
  XMLrequest += "<Password>" + data.password + "</Password>";
  XMLrequest += "</AccessRequest>";

  XMLrequest += "<?xml version='1.0' encoding='utf-8'?>";
  XMLrequest += "	<TrackRequest xml:lang='en-US'>";
  XMLrequest += "	  <Request>";
  XMLrequest += "	    <TransactionReference>";

  if (!data.customerContext) reject("Missing Customer Context");
  XMLrequest += "	      <CustomerContext>" + data.customerContext + "</CustomerContext>";

  XMLrequest += "	       <XpciVersion>1.0</XpciVersion>";
  XMLrequest += "	    </TransactionReference>";
  XMLrequest += "	    <RequestAction>Track</RequestAction>";
  XMLrequest += "	    <RequestOption>activity</RequestOption>";
  XMLrequest += "	  </Request>";

  if (!data.trackingNumber) reject("Missing Tracking Number");
  XMLrequest += "	  <TrackingNumber>" + data.trackingNumber + "</TrackingNumber>";

  XMLrequest += "	</TrackRequest>";

  return { body: XMLrequest };
}

module.exports = Tracking;
