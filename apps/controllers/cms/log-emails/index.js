const db = require("../../../models");
const logEmail = db.logEmail;
const publishedParticipant = db.publishedParticipant;
const { Op } = require("sequelize");
// const { authenticateCmsJWT } = require('../../../middleware/AuthenticateCmsJwt/authenticateJwt');

require("dotenv").config();

exports.list = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;

    const limit = Number(10);
    const findDatas = await logEmail.findAndCountAll({
      include: [
        {
          model: publishedParticipant,
        },
      ],
      where: {
        [Op.or]: [{ subject: { [Op.like]: `%${search || ""}%` } }],
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset: (Number(page) - 1) * limit,
      distinct: true,
    });

    res.status(200).json({
      code: "200",
      status: "OK",
      data: {
        totalItems: findDatas.count,
        items: findDatas.rows,
        totalPages:
          findDatas.rows.length == 0 ? 1 : Math.ceil(findDatas.count / limit),
        currentPage: Number(page),
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
