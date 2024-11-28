const db = require("../../../models");
const badge = db.badge;
const certificate = db.certificate;
const publishProgram = db.publishedProgram;
const publishParticipant = db.publishedParticipant;
const { Op } = require("sequelize");
// const { authenticateCmsJWT } = require('../../../middleware/AuthenticateCmsJwt/authenticateJwt');

require("dotenv").config();

exports.listCertificate = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });

    const data = await publishProgram.findAll({
      include: [
        {
          model: publishParticipant,
          where: {
            slug1: req.params.slugParticipant,
          },
        },
        {
          model: certificate,
          include: [
            {
              model: badge
            },
          ],
        }
      ],
    });
    if (data.length === 0) throw { code: "400", errors: ["Record not found!"] };
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.showCertificate = async (req, res) => {
  try {
    // console.log(req.params.slugProgram);
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });
    const modifiedSlugProgram = req.params.slugProgram
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const data = await publishProgram.findOne({
      where: {
        slug: req.params.slugProgram,
      },
      include: [
        {
          model: certificate,
        },
        {
          model: publishParticipant,
          where: {
            slug1: req.params.slugParticipant,
          },
        },
      ],
    });
    // console.log (data);
    if (data === null) throw { code: "400", errors: ["Record not found!"] };
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
