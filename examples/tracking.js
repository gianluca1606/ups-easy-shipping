const { Tracking } = require("../index.js");

const main = async () => {
  try {
    const tracking = new Tracking("test123", "test123", "Test123");

    tracking.useSandbox(true);
    tracking.setJsonResponse(true);

    const result = await tracking.makeRequest({
      trackingNumber: "FDSJ324832JFS",
      customerContext: "FDSJ324832JFS",
    });

    // if you receive XML Bacl please be aware of using
    // result.toString("utf8") in order to get an XML String
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

main();
