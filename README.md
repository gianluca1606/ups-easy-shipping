UPS-EASY-SHIPPING: An easy to use NodeJS module for integrating UPS APIs based on Promises
Forked from (https://github.com/gianluca1606/ups-easy-shipping)
=======================

Each UPS API has a corresponding manual which mostly contains hundreds of pages long and reading every book is quite pain in the ass. Unfortunately there is no provided example written in Node.JS.

Check it out boys and girls and see it for yourself. [UPS Developers Guide] (https://www.ups.com/upsdeveloperkit)

### Warning

the library is not tested at the moment since i do not have a valid license id, feel free to contribute and correct some erros.

#### Dead Simple

By using promises everything gets easier. Forget about those boring hundred of pages manuals. This is a very simple NodeJS module for integrating UPS APIs.

#### Supports JSON Request and Response

Direct UPS APIs still use plain old XML for their web services. But don't worry.
UPS-EASY-SHIPPING supports JSON and XML.

#### How to start?

Before we start, you need to have an access to UPS API. Getting access to the UPS developer tools is pretty easy. The first thing you'll want to do is:

[Register for UPS Online Tools] (https://www.ups.com/servlet/registration?loc=en_US&returnto=http%3A%2F%2Fwww.ups.com%2Fe_comm_access%2FlaServ%3Floc%3Den_US)

#### What are the available APIs?

| API                    | Status    |
| ---------------------- | --------- |
| shipConfirm            | available |
| shipAccept             | available |
| addressValidation      | available |
| voidShipment           | available |
| timeInTransit          | available |
| ratingServiceSelection | available |
| tracking               | available |

#### Start Rocking!

so are you ready? let's see it in action.

## 1) How Shipping Services Work

Shipping Services give your applications many ways to manage the shipment of small packages to their destination. UPS offers a range of delivery time frames from same day to standard ground transportation. Shipments may be within the United States or international, and they may range from letter documents to large packages.

The process to use the Shipping API consists of two phases, the ship confirm phase followed by the ship accept phase.

### ShipConfirm

##### Initialization

    const { UPS } = require("../index.js");

    var confirmShipment = new ShipConfirm(<API licenseId>, <API userId>, <API password>);

     const ups = new UPS(<API licenseId>, <API userId>, <API password>, < API SANDBOX>, < API useJSON>);

##### Switch to Sandbox

// method coming soon
ups.useSandbox(true);

##### Response as JSON

// method coming soon
ups.setJsonResponse(true);

##### Start making a Request

const result = await ups.AdressValidationRequest({
customerContext: "Customer Data",
city: "Miami",
stateProvinceCode: "FL",
});

Afther that you can use the result however you want.

##### Full examples

For more examples you can check the examples folder

# License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
