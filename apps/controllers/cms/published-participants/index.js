const db = require("../../../models");
// const { authenticateCmsJWT } = require('../../../middleware/AuthenticateCmsJwt/authenticateJwt');
const publishProgram = db.publishedProgram;
const publishParticipant = db.publishedParticipant;
const programSkill = db.programSkill;
const skill = db.skill;
const republishedHistory = db.republishedHistory;
require("dotenv").config();
const sendEmail = require("../../../middleware/mail/mail");
const { Op, where } = require("sequelize");

exports.show = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });

    const data = await publishParticipant.findOne({
      include: [
        {
          model: publishProgram,
          include: [
            {
              model: programSkill,
              include: [
                {
                  model: skill,
                },
              ],
            },
          ],
        },
      ],
      where: { id: req.params.id },
    });
    if (!data) throw { code: "400", errors: ["Record not found!"] };
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.update = async (req, res) => {
  try {
    //   const cek = await authenticateCmsJWT(req.headers.authorization);
    //   if (cek.login === false)
    //     return res.status(500).send({ message: `${cek.data} !` });

    const { nameOnCertificate, deliveryEmail, statusGraduation, updatedBy } =
      req.body;

    if (!nameOnCertificate)
      throw { code: "400", errors: ["Name Certificate is required"] };
    if (!deliveryEmail)
      throw { code: "400", errors: ["Delivery Email is required"] };
    if (!statusGraduation)
      throw { code: "400", errors: ["Status Graduation is required"] };

    const cekData = await publishParticipant.findOne({
      where: { id: req.params.id },
    });
    if (!cekData) throw { code: "400", errors: ["Record not found!"] };

    const payload = {
      nameOnCertificate: nameOnCertificate,
      deliveryEmail: deliveryEmail,
      statusGraduation: statusGraduation,
      updatedBy: updatedBy,
    };
    await publishParticipant.update(payload, { where: { id: req.params.id } });
    return res.status(200).send({
      message: "Successfully updated record!",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.list = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;

    const limit = Number(10);
    const findDatas = await publishParticipant.findAndCountAll({
      include: [
        {
          model: publishProgram,
        },
      ],
      where: {
        [Op.or]: [
          { linkCertificate: { [Op.like]: `%${search || ""}%` } },
          { deliveryEmail: { [Op.like]: `%${search || ""}%` } },
          { nameOnCertificate: { [Op.like]: `%${search || ""}%` } },
          { lmsFullname: { [Op.like]: `%${search || ""}%` } },
        ],
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

exports.updateDeliveryEmail = async (req, res) => {
  try {
    //   const cek = await authenticateCmsJWT(req.headers.authorization);
    //   if (cek.login === false)
    //     return res.status(500).send({ message: `${cek.data} !` });

    const { deliveryEmail, partcipantIds, updatedBy } = req.body;

    if (!deliveryEmail)
      throw { code: "400", errors: ["Delivery Email is required"] };
    if (partcipantIds.length === 0)
      throw { code: "400", errors: ["Participants is required"] };
    // console.log(partcipantIds.length);
    // return false;

    for (const participant of partcipantIds) {
      await publishParticipant.update(
        {
          deliveryEmail: deliveryEmail,
          updatedBy: updatedBy,
        },
        { where: { id: participant } }
      );
    }
    return res.status(200).send({
      message: "Successfully updated record!",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.republish = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });
    const { programId, participantId, title, body, updatedBy } = req.body;

    if (!programId) throw { code: "400", errors: ["Program ID is required"] };
    if (!participantId)
      throw { code: "400", errors: ["Participant ID is required"] };

    const participant = await publishParticipant.findOne({
      include: [
        {
          model: publishProgram,
        },
      ],
      where: { id: participantId },
    });

    if (!participant) throw { code: "400", errors: ["Record not found!"] };

    const payload = {
      programId: programId,
      title: title,
      body: body,
      createdBy: updatedBy || "System",
      updatedBy: updatedBy || "System",
    };
    const newData = await republishedHistory.create(payload);

    // Send email to client
    const htmlBody = `
      <div><b>Yth. Bpk / Ibu ${participant?.lmsFullname}</b></div>
      <br />
      <div><b>Hal : <span style="color: #26D07C">${title}</span></b></div>
      <br />
      <div>Terima kasih sudah memilih prasmul-eli sebagai partner pengembangan skill anda.</div>
      <div>Adapun maksud kami mengirimkan email ini.</div>
      ${body}
      <div>Link <b>Achievements & Digital Certificate</b> terkait program di atas yang sudah kami perbarui.</div>
      <br />
      <table>
        <tr>
          <th style="text-align: left;">1. Link Achievements</th>
          <th>:</th>
          <th style="text-align: left;">${participant.linkAchievement}</th>
        </tr>
        <tr>
          <th style="text-align: left;">2. Link Certificate</th>
          <th>:</th>
          <th style="text-align: left;">${participant.linkCertificate}</th>
        </tr>
      </table>
      <br />
      <div>Demikian informasi ini kami sampaikan sampai bertemu di program pelatihan lainnya.</div>
      <br />
      <div>Salam Hormat,</div>
      <div><b><u>Program Support Prasmul ELI</u></b</div>
      <br />
      <br />
      <div style="color: #26D07C"><i>NB: Email terkirim otomatis oleh sistem.</i></div>
  `;

    const optionsTransporter = {
      from: `no-reply@prasmul-eli.co`,
      to: `< ${participant?.deliveryEmail} > `,
      cc: [],
      subject: title,
      html: htmlBody,
      attachments: [],
    };

    sendEmail({ optionsTransporter: optionsTransporter });

    return res.status(200).send({
      message: "Successfully Republish Certificate!",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.filterData = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false)
    //   return res.status(500).send({ message: `${cek.data} !` });
    const { statusPublish, page } = req.body;

    if (!statusPublish)
      throw { code: "400", errors: ["Status Publish is required"] };

    const limit = Number(10);
    const findData = await publishParticipant.findAndCountAll({
      include: [
        {
          model: publishProgram,
          where: { status: statusPublish },
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset: (Number(page) - 1) * limit,
      distinct: true,
    });

    res.status(200).json({
      code: "200",
      status: "OK",
      data: {
        totalItems: findData.count,
        items: findData.rows,
        totalPages:
          findData.rows.length == 0 ? 1 : Math.ceil(findData.count / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Server mengalami gangguan !", error });
  }
};
