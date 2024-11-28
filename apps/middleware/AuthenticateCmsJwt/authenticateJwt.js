const db = require("../../models");
const administrator = db.administrator;
const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports.authenticateCmsJWT = async (token) => {
  // console.log(token)
  let authHeader = token;
  // // If the token is present

  const expirationTimeInSeconds = 3600; // 1 hour

  if (authHeader) {
    // Verify the token using jwt.verify method
    try {
      const tokenConvert = authHeader.split(" ")[1];
      const decode = jwt.verify(tokenConvert, process.env.SECRET_KEY_CMS);
      
      const cekData = await administrator.findOne({
        where: { id: decode.data.id }
      });
      
      //  Return response with decode data
      return {
        login: true,
        data: cekData,
      };
    } catch (error) {
      // Return response with error
      return {
        login: false,
        data: "error" + error,
      };
    }
  } else {
    return {
      login: false,
      data: "Unauthorize",
    };
  }
};
