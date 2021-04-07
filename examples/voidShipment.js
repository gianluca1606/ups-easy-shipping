const { VoidShipment } = require("../index.js");

const main = async () => {
  try {
    const voidShipment = new VoidShipment("test123", "test123", "Test123");

    voidShipment.useSandbox(true);
    voidShipment.setJsonResponse(true);

    const result = await voidShipment.makeRequest({
      tracking: "FDSJ324832JFS",
    });

    // if you receive XML Bacl please be aware of using
    // result.toString("utf8") in order to get an XML String
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

main();
