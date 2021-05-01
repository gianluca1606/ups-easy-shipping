const https = require("https");
const buildAccesRequest = require("../utils/accesRequest");

createRating = function() {
    return function RatingRequest(options) {
        settings = this;
        return new Promise(function(resolve, reject) {
            try {
                const req = https.request({
                    host: settings.sandbox ? settings.SANDBOX_API : settings.LIVE_API,
                    path: "/ups.app/xml/Rate",
                    method: "POST",
                });

                /* build the request data for rating and write it to
		               the request body
                */
                const { body } = buildRequestData(options, reject);

                req.write(body);

                req.on("response", function(res) {
                    let responseData = "";

                    res.on("data", function(data) {
                        data = data.toString();
                        responseData += data;
                    });

                    res.on("end", function() {
                        if (settings.useJSON) {
                            let parseString = require("xml2js").parseString;
                            parseString(responseData, function(err, result) {
                                if (err) reject(err.message);
                                if (result.RatingServiceSelectionResponse.Response[0].Error) {
                                    reject(result.RatingServiceSelectionResponse.Response[0].Error[0]);
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

function buildRequestData(data) {
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
    XMLrequest += "	<RatingServiceSelectionRequest xml:lang='en-US'>";
    XMLrequest += "	  <Request>";
    XMLrequest += "	    <TransactionReference>";

    if (!data.customerContext) reject("Missing Customer Context");

    XMLrequest += "	      <CustomerContext>Rating and Service</CustomerContext>";
    XMLrequest += "	      <XpciVersion>1.0</XpciVersion>";
    XMLrequest += "	    </TransactionReference>";
    XMLrequest += "		<RequestAction>Rate</RequestAction>";
    XMLrequest += "	  </Request>";

    if (!data.pickUpType) reject("Missing Pickup Type");
    let pickUpType = data.pickUpType;

    XMLrequest += "	    <PickupType>";
    XMLrequest += "	  	<Code>" + pickUpType.code + "</Code>";
    XMLrequest += "	  	<Description>" + pickUpType.description + "</Description>";
    XMLrequest += "	    </PickupType>";

    if (!data.shipment) reject("Missing Shipment");
    let shipment = data.shipment;

    XMLrequest += "	  <Shipment>";
    XMLrequest += "	    	<Description>" + shipment.description + "</Description>";
    XMLrequest += "	    <Shipper>";
    XMLrequest += "	      <Name>" + shipment.name + "</Name>";
    XMLrequest += "	      <PhoneNumber>" + shipment.phoneNumber + "</PhoneNumber>";
    XMLrequest += "	      <ShipperNumber>" + shipment.shipperNumber + "</ShipperNumber>";

    if (!data.shipment.shipper.address) reject("Missing shipment address");
    let shipperAddress = data.shipment.shipper.address;

    XMLrequest += "	      <Address>";
    XMLrequest += "	        <AddressLine1>" + shipperAddress.addressLine + "</AddressLine1>";
    XMLrequest += "	        <City>" + shipperAddress.city + "</City>";
    XMLrequest +=
        "	        <StateProvinceCode>" +
        shipperAddress.StateProvinceCode +
        "</StateProvinceCode>";
    XMLrequest += "	        <PostalCode>" + shipperAddress.PostalCode + "</PostalCode>";
    XMLrequest += "	        <CountryCode>" + shipperAddress.countryCode + "</CountryCode>";
    XMLrequest += "	      </Address>";
    XMLrequest += "	    </Shipper>";

    if (!data.shipment.shipTo) reject("Missing ShipTo");
    let shipTo = data.shipment.shipTo;

    XMLrequest += "	    <ShipTo>";
    XMLrequest += "	      <CompanyName>" + shipTo.companyName + "</CompanyName>";
    XMLrequest += "	      <PhoneNumber>" + shipTo.phoneNumber + "</PhoneNumber>";
    XMLrequest += "	      <Address>";
    XMLrequest += "	        <AddressLine1>" + shipTo.address.addressLine + "</AddressLine1>";
    XMLrequest += "	        <City>" + shipTo.address.city + "</City>";
    XMLrequest += "	        <PostalCode>" + shipTo.address.postalCode + "</PostalCode>";
    XMLrequest += "	        <CountryCode>" + shipTo.address.countryCode + "</CountryCode>";
    XMLrequest += "	      </Address>";
    XMLrequest += "	    </ShipTo>";

    if (!data.shipment.shipFrom) reject("Missing shipFrom");
    let shipFrom = data.shipment.shipFrom;

    XMLrequest += "	    <ShipFrom>";
    XMLrequest += "	      <CompanyName>" + shipFrom.companyName + "</CompanyName>";
    XMLrequest += "	      <AttentionName>" + shipFrom.attentionName + "</AttentionName>";
    XMLrequest += "	      <PhoneNumber>" + shipFrom.phoneNumber + "</PhoneNumber>";
    XMLrequest += "	      <FaxNumber>" + shipFrom.faxNumber + "</FaxNumber>";
    XMLrequest += "	      <Address>";
    XMLrequest +=
        "	        <AddressLine1>" + shipFrom.address.addressLine + "</AddressLine1>";
    XMLrequest += "			<City>" + shipFrom.address.city + "</City>";
    XMLrequest +=
        "	        <StateProvinceCode>" +
        shipFrom.address.stateProvinceCode +
        "</StateProvinceCode>";
    XMLrequest += "	        <PostalCode>" + shipFrom.address.postalCode + "</PostalCode>";
    XMLrequest += "	        <CountryCode>" + shipFrom.address.countryCode + "</CountryCode>";
    XMLrequest += "	      </Address>";
    XMLrequest += "	    </ShipFrom>";

    if (!data.shipment.service) reject("Missing shipment service");
    let service = data.shipment.service;

    XMLrequest += "	  	<Service>";
    XMLrequest += "	    		<Code>" + service.code + "</Code>";
    XMLrequest += "	  	</Service>";

    if (!data.shipment.paymentInformation) reject("Missing Payment Information");
    let paymentInformation = data.shipment.paymentInformation;

    XMLrequest += "	  	<PaymentInformation>";
    XMLrequest += "		      	<Prepaid>";
    XMLrequest += "	        		<BillShipper>";
    XMLrequest +=
        "	          			<AccountNumber>" + paymentInformation.accountNumber + "</AccountNumber>";
    XMLrequest += "	        		</BillShipper>";
    XMLrequest += "	      		</Prepaid>";
    XMLrequest += "	  	</PaymentInformation>";

    if (!data.shipment.package) reject("Missing Shipment Packages");

    data.shipment.package.forEach(function(val) {
        XMLrequest += "<Package>";
        insert = buildPackageInternals(val);
        if (insert) XMLrequest += insert;
        else reject("Bad Package Internals");
        XMLrequest += "</Package>";
    });

    if (!data.shipment.schedule) reject("Missing Shipment Schedule");

    let schedule = data.shipment.schedule;

    XMLrequest += "	    <ShipmentServiceOptions>";
    XMLrequest += "	      <OnCallAir>";
    XMLrequest += "			<Schedule>";
    XMLrequest += "				<PickupDay>" + schedule.pickUpDay + "</PickupDay>";
    XMLrequest += "				<Method>" + schedule.method + "</Method>";
    XMLrequest += "			</Schedule>";
    XMLrequest += "	      </OnCallAir>";
    XMLrequest += "	    </ShipmentServiceOptions>";
    XMLrequest += "	  </Shipment>";
    XMLrequest += "	</RatingServiceSelectionRequest>";

    return { body: XMLrequest };
}

const buildPackageInternals = function(val) {
    let XMLrequest = "";

    if (val.description) {
        XMLrequest += "<Description>";
        XMLrequest += val.description;
        XMLrequest += "</Description>";
    }

    XMLrequest += "<PackagingType>";
    XMLrequest += "<Code>";
    XMLrequest += val.code || "02";
    XMLrequest += "</Code>";
    XMLrequest += "</PackagingType>";

    XMLrequest += "<PackageWeight>";
    XMLrequest += "<Weight>";
    XMLrequest += val.weight || "1";
    XMLrequest += "</Weight>";
    XMLrequest += "</PackageWeight>";

    //TODO: Insurance
    if (val.insurance) {
        XMLrequest += "<PackageServiceOptions>";
        XMLrequest += "<InsuredValue>";
        XMLrequest += buildInsurance(val.insurance);
        XMLrequest += "</InsuredValue>";
        XMLrequest += "</PackageServiceOptions>";
    }
    return XMLrequest;
};

module.exports = createRating;