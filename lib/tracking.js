const https = require("https");

createTracking = function () {
  return function TrackingRequest(options) {
    settings = this;
    return new Promise(function (resolve, reject) {
      try {
        const req = https.request({
          host: settings.sandbox ? settings.SANDBOX_API : settings.LIVE_API,
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
            if (settings.useJSON) {
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
};

module.exports = createTracking;
