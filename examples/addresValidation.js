const { AddressValidation } = require("../index.js");

const main = async () => {
  try {
    const AdressValidationn = new AddressValidation("test123", "test123", "Test123");

    AdressValidationn.useSandbox(true);
    AdressValidationn.setJsonResponse(true);

    const result = await AdressValidationn.makeRequest({
      customerContext: "Customer Data",
      city: "Miami",
      stateProvinceCode: "FL",
    });

    // if you receive XML Bacl please be aware of using
    // result.toString("utf8") in order to get an XML String
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

main();
