var express = require("express");
var ensureLogIn = require("connect-ensure-login").ensureLoggedIn;
var router = express.Router();
const ASGARDEO_BASE_URL = "https://api.asgardeo.io/t/";

var ensureLoggedIn = ensureLogIn();

router.get("/protected", ensureLoggedIn, async function (req, res, next) {
  try {
    console.log("Calling scim2/Me endpoint");
    const response = await fetch(
      ASGARDEO_BASE_URL + process.env.ASGARDEO_ORGANISATION + "/scim2/Me",
      {
        method: "GET",
        headers: {
          Accept: "application/scim+json",
          "Content-Type": "application/scim+json",
          Authorization: `Bearer ${req?.user?.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Response: " + JSON.stringify(await response.json(), null, 2)
      );
    }

    console.log(
      "Protected data fetched. Response: " +
        JSON.stringify(await response.json(), null, 2)
    );
  } catch (error) {
    console.error("Failed to fetch protected data: ", error);
  }

  return res.render("protected");
});

module.exports = router;
