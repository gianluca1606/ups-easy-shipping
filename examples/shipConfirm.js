const { UPS } = require("../index.js");

const main = async () => {
  try {
    const ups = new UPS("test123", "test123", "Test123", true, true);

    const result = await ups.ShipConfirmRequest({
      validate: "nonvalidate",
      shipment: {
        description: "Shipment to Philippines",
        shipper: {
          name: "Metro Inc Limited",
          attentionName: "John Doe",
          phone: "12311",
          shipperNumber: "A123B89",
          phone: "1212311",
          address: {
            address1: "Flat 9999",
            address2: "Sun West Center Mall",
            address3: "25 West Yip Street",
            city: "Miami",
            state: "HK",
            country: "HK",
            zip: "75093",
          },
        },
        shipTo: {
          companyName: "Company Name",
          attentionName: "Pedro Calunsod",
          phone: "12321341",
          address: {
            address1: "999 Warrior St.",
            address2: "Maria Cons. Subd. Shiper",
            address3: "Stage, Valley",
            city: "Stage City",
            state: "PH",
            country: "PH",
            zip: "2010",
          },
        },
        payment: {
          accountNumber: "A123B89",
        },
        service: {
          code: "expedited",
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
