const db = require("../../../models");
const programSkill = db.programSkill;
const skill = db.skill;
const { Op } = require("sequelize");
// const { authenticateCmsJWT } = require('../../../middleware/AuthenticateCmsJwt/authenticateJwt');

require("dotenv").config();

exports.showByCategory = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });

    const data = await programSkill.findAll({
      include: [
        {
          model: skill,
        },
      ],
      where: { lmsCategoryId: req.params.lmsCategoryId },
    });
    if (!data)
      return res.status(400).send({ message: "Record not found!", error });
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
