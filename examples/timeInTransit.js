const { TimeInTransit } = require("../index.js");

const main = async () => {
  try {
    const timeInTransit = new TimeInTransit("test123", "test123", "Test123");

    timeInTransit.useSandbox(true);
    timeInTransit.setJsonResponse(true);

    const result = await timeInTransit.makeRequest({
      customerContext: "Walter White",
      transitFrom: {
        fromCountryCode: "US",
        fromCountry: "New York",
        fromDivision1: "Breaking Bad City",
      },
      transitTo: {
        toCountryCode: "US",
        postCode: "90001",
      },
      shipmentWeight: {
        code: "02",
        description: "test",
        weight: "01",
      },
      totalPackageShipment: "1",
      invoiceLineTotal: {
        currencyCode: "US",
        monetaryValue: "DOL",
      },
      pickupDate: "YYYYMMDD",
    });

    // if you receive XML Bacl please be aware of using
    // result.toString("utf8") in order to get an XML String
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

main();
