require("dotenv").config();

exports.checkVersion = async (req, res) => {
  return res.status(200).send({
    version: "1.0.10",
  });
};
