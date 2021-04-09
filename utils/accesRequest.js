const buildAccesRequest = (licenseId, userId, password) => {
  let accesRequest = "";
  accesRequest += "<AccessRequest xml:lang='en-US'>";
  accesRequest += "<AccessLicenseNumber>" + licenseId + "</AccessLicenseNumber>";
  accesRequest += "<UserId>" + userId + "</UserId>";
  accesRequest += "<Password>" + password + "</Password>";
  accesRequest += "</AccessRequest>";
  return accesRequest;
};

module.exports = buildAccesRequest;
