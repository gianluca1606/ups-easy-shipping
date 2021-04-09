const { UPS } = require("../index.js");

const main = async () => {
  try {
    const ups = new UPS("test123", "test123", "Test123", true, true);

    const result = await ups.AdressValidationRequest({
      customerContext: "Customer Data",
      city: "Miami",
      stateProvinceCode: "FL",
    });

    // if you receive XML Back please be aware of using
    // result.toString("utf8") in order to get an XML String
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

main();
