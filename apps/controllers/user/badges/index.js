const db = require("../../../models");
const certificate = db.certificate;
const badge = db.badge;
const programSkill = db.programSkill;
const skill = db.skill;
const publishProgram = db.publishedProgram;
const publishParticipant = db.publishedParticipant;
const { Op } = require("sequelize");
// const { authenticateCmsJWT } = require('../../../middleware/AuthenticateCmsJwt/authenticateJwt');

require("dotenv").config();

exports.showBadges = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });

    // const checkProgram = await publishProgram.count({
    //   where: {
    //     slug: req.params.slugProgram,
    //   },
    // });
    // if (checkProgram === 0)
    //   throw { code: "400", errors: ["Program not found!"] };

    // const checkParticipant = await publishParticipant.findOne({
    //   where: {
    //     slug1: req.params.slugParticipant,
    //   },
    // });
    // if (!checkParticipant)
    //   throw { code: "400", errors: ["Participant not found!"] };

    const data = await publishProgram.findAll({
      where: {
        slug: req.params.slugProgram,
      },
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
        },
        {
          model: programSkill,
          include: [
            {
              model: skill,
            },
          ],
        },
      ],
    });
    if (data.length === 0) throw { code: "400", errors: ["Record not found!"] };
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
