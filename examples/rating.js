const { Rating } = require("../index.js");

const main = async () => {
  try {
    const Ratingg = new Rating("test123", "test123", "Test123");

    Ratingg.useSandbox(true);
    Ratingg.setJsonResponse(true);

    const result = await Ratingg.makeRequest({
      customerContext: "Rating and Service",
      pickUpType: {
        code: "07",
        description: "Rate",
      },
      shipment: {
        description: "Rate Description",
        name: "Name",
        phoneNumber: "1234567890",
        shipperNumber: "Ship Number",
        shipper: {
          address: {
            addressLine: "Address Line",
            city: "City",
            StateProvinceCode: "NJ",
            PostalCode: "07430",
            countryCode: "US",
          },
        },
        shipTo: {
          companyName: "Company Name",
          phoneNumber: "1234567890",
          address: {
            addressLine: "Address Line",
            city: "Corado",
            postalCode: "00646",
            countryCode: "PR",
          },
        },
        shipFrom: {
          companyName: "Company Name",
          attentionName: "Attention Name",
          phoneNumber: "1234567890",
          faxNumber: "1234567890",
          address: {
            addressLine: "Address Line",
            city: "Boca Raton",
            stateProvinceCode: "FL",
            postalCode: "33434",
            countryCode: "US",
          },
        },
        service: {
          code: "03",
        },
        paymentInformation: {
          accountNumber: "Ship Number",
        },
        package: [
          {
            code: "02",
            weight: "1",
          },
          {
            code: "02",
            weight: "1",
          },
        ],
        schedule: {
          pickUpDay: "02",
          method: "02",
        },
      },
    });

    // if you receive XML Bacl please be aware of using
    // result.toString("utf8") in order to get an XML String
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

main();
