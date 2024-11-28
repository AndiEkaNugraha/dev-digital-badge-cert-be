const db = require("../../../models");
// const { authenticateCmsJWT } = require('../../../middleware/AuthenticateCmsJwt/authenticateJwt');
const certificateTemplate = db.certificateTemplate;
const certificate = db.certificate;
const badge = db.badge;
const publishProgram = db.publishedProgram;
const publishParticipant = db.publishedParticipant;
const programSkill = db.programSkill;
const skill = db.skill;
const republishedHistory = db.republishedHistory;
const logsEmail = db.logEmail;
require("dotenv").config();
const { generateCertificateNumber } = require("../../../helpers");
const sendEmail = require("../../../middleware/mail/mail");
const { Op } = require("sequelize");

exports.save = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });
    const {
      certificateId,
      lmsCourseId,
      lmsCourseName,
      lmsCategoryName,
      lmsCategoryId,
      publishDate,
      startDate,
      endDate,
      expiredDate,
      description,
      status,
      createdBy,
      students,
      skills,
    } = req.body;

    if (!certificateId)
      throw { code: "400", errors: ["Certificate is required"] };
    if (!lmsCourseId) throw { code: "400", errors: ["Course ID is required"] };
    if (!lmsCourseName)
      throw { code: "400", errors: ["Course Name is required"] };
    if (!lmsCategoryName)
      throw { code: "400", errors: ["Category Name is required"] };
    if (!lmsCategoryId)
      throw { code: "400", errors: ["Category Course ID is required"] };
    if (!startDate) throw { code: "400", errors: ["Start Date is required"] };
    if (!endDate) throw { code: "400", errors: ["End Date is required"] };
    if (!status) throw { code: "400", errors: ["Status is required"] };
    if (students.length === 0)
      throw { code: "400", errors: ["Students is required"] };
    // if (skills.length === 0)
    //   throw { code: "400", errors: ["Skills is required"] };

    const programIsExist = await publishProgram.findOne({
      where: { lmsCourseId: lmsCourseId },
    });
    if (programIsExist) {
      throw { code: "400", errors: ["Course already exist!"] };
    }

    const payload = {
      certificateId: certificateId,
      lmsCourseId: lmsCourseId,
      lmsCourseName: lmsCourseName,
      lmsCategoryName: lmsCategoryName,
      lmsCategoryId: lmsCategoryId,
      publishDate: publishDate || null,
      startDate: startDate,
      endDate: endDate,
      expiredDate: expiredDate || null,
      description: description,
      status: status,
      createdBy: createdBy || "System",
      updatedBy: "",
    };
    const newData = await publishProgram.create(payload);

    // Replace spaces with hyphens and convert to lowercase
    const formatedCategory = lmsCategoryName.toLowerCase().replace(/ /g, "-");

    const newStudents = [];
    students.forEach((item) => {
      console.log(item.lmsFullname);
      let formatedName = item.lmsFullname.toLowerCase().replace(/ /g, "-");
      let slug1 = formatedName.concat("-").concat(item.lmsUserId);
      let formatedCertificateNumber = generateCertificateNumber();
      newStudents.push({
        lmsUserId: item.lmsUserId,
        programId: newData.id,
        certificateNumber: formatedCertificateNumber,
        lmsFullname: item.lmsFullname,
        nameOnCertificate: item.nameOnCertificate,
        lmsEmail: item.lmsEmail,
        deliveryEmail: item.deliveryEmail,
        statusGraduation: item.statusGraduation,
        linkAchievement: `https://digital-certificate.prasmul-eli.co/achievement/${slug1}`, // show all badges
        linkProfileBadge: `https://digital-certificate.prasmul-eli.co/badge/${newData.slug}/${slug1}`, // show one badge with slug program and participant name
        linkCertificate: `https://digital-certificate.prasmul-eli.co/certificate/${slug1}/${formatedCategory}`, // show one certificate with participant name and program name
        lmsLinkedin: item.lmsLinkedin,
        lmsProfilePicture: item.lmsProfilePicture,
        lmsDepartment: item.lmsDepartment,
        lmsPhone1: item.lmsPhone1,
        lmsPhone2: item.lmsPhone2,
        lmsAddress: item.lmsAddress,
        lmsCompany: item.lmsCompany,
        lmsBioDecription: item.lmsBioDecription,
        slug1: slug1,
        createdBy: createdBy || "System",
        updatedBy: "",
      });
    });

    // Insert participants into the database
    await publishParticipant.bulkCreate(newStudents);

    if (skills.length > 0) {
      const newMapingSkills = [];
      skills.forEach((skill) => {
        newMapingSkills.push({
          skillId: skill.id,
          lmsCategoryId: lmsCategoryId,
          programId: newData.id,
          createdBy: createdBy || "System",
          updatedBy: "",
        });
      });

      // Insert skills into the database
      await programSkill.bulkCreate(newMapingSkills);
    }

    return res.status(200).send({
      message: "Successfully new record!",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.show = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });

    const data = await publishProgram.findOne({
      include: [
        {
          model: certificate,
          include: [
            {
              model: badge,
            },
            {
              model: certificateTemplate,
            },
          ],
        },
        {
          model: publishParticipant,
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

    const {
      certificateId,
      publishDate,
      startDate,
      endDate,
      expiredDate,
      description,
      status,
      skills,
      updatedBy,
      createdBy,
    } = req.body;
    // if (!publishDate)
    //   throw { code: "400", errors: ["Publish Date is required"] };
    // if (!expiredDate)
    //   throw { code: "400", errors: ["Expired Date is required"] };
    if (!startDate) throw { code: "400", errors: ["Start Date is required"] };
    if (!endDate) throw { code: "400", errors: ["End Date is required"] };
    if (!status) throw { code: "400", errors: ["Status is required"] };
    if (!certificateId)
      throw { code: "400", errors: ["Certificate is required"] };
    // if (skills.length === 0)
    //   throw { code: "400", errors: ["Skills is required"] };

    const cekData = await publishProgram.findOne({
      where: { id: req.params.id },
    });
    if (!cekData) throw { code: "400", errors: ["Record not found!"] };

    if (skills.length > 0) {
      // delete old program skills
      await programSkill.destroy({ where: { programId: req.params.id } });

      const newMapingSkills = [];
      skills.forEach((skill) => {
        newMapingSkills.push({
          skillId: skill.id,
          lmsCategoryId: cekData.lmsCategoryId,
          programId: req.params.id,
          updatedBy: updatedBy || "System",
          createdBy: createdBy || "System",
        });
      });

      // Insert skills into the database
      await programSkill.bulkCreate(newMapingSkills);
    }

    const payload = {
      publishDate: publishDate,
      certificateId: certificateId,
      expiredDate: expiredDate || null,
      startDate: startDate,
      endDate: endDate,
      status: status,
      description: description,
      updatedBy: updatedBy,
      createdBy: createdBy,
    };
    console.log(payload);
    await publishProgram.update(payload, { where: { id: req.params.id } });
    return res.status(200).send({
      message: "Successfully updated record!",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.publish = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });
    const { programId } = req.body;

    if (!programId) throw { code: "400", errors: ["Program ID is required"] };

    const program = await publishProgram.findOne({
      include: [
        {
          model: publishParticipant,
        },
      ],
      where: { id: programId },
    });

    if (!program) throw { code: "400", errors: ["Record not found!"] };
    const date = new Date();
    const dateString = date.toISOString().split("T")[0];
    const payload = {
      status: "Published",
      publishDate: dateString,
    };
    await publishProgram.update(
      payload, // Update the status to 'Published'
      { where: { id: programId } }
    );
    // const emailPromises = program?.publishedParticipants.map(async (item) => {
    //   const rowItem = await publishParticipant.findOne({
    //     where: { id: item.id },
    //   });

    //   if (rowItem) {
    //     const htmlBody = `
    //     <div><b>Yth. Bpk / Ibu ${rowItem?.lmsFullname}</b></div>
    //     <br />
    //     <div><b>Hal : <span style="color: #26D07C">Digital Badge & Certification ${program?.lmsCourseName}</span></b></div>
    //     <br />
    //     <div>Terima kasih sudah memilih prasmul-eli sebagai partner pengembangan skill anda.</div>
    //     <div>Bersama ini kami kirimkan link <b>Achievements & Digital Certificate</b> terkait program di atas.</div>
    //     <br />
    //     <table>
    //       <tr>
    //         <th style="text-align: left;">1. Link Achievements</th>
    //         <th>:</th>
    //         <th style="text-align: left;">${rowItem.linkAchievement}</th>
    //       </tr>
    //       <tr>
    //         <th style="text-align: left;">2. Link Certificate</th>
    //         <th>:</th>
    //         <th style="text-align: left;">${rowItem.linkCertificate}</th>
    //       </tr>
    //     </table>
    //     <br />
    //     <div>Demikian informasi ini kami sampaikan sampai bertemu di program pelatihan lainnya.</div>
    //     <br />
    //     <div>Salam Hormat,</div>
    //     <div><b><u>Program Support Prasmul ELI</u></b></div>
    //     <br />
    //     <br />
    //     <div style="color: #26D07C"><i>NB: Email terkirim otomatis oleh sistem.</i></div>
    //   `;

    //     const optionsTransporter = {
    //       from: `no-reply@prasmul-eli.co`,
    //       to: rowItem.deliveryEmail,
    //       subject: `Prasmul ELI - Digital Badge & Certification ${program?.lmsCourseName}`,
    //       html: htmlBody,
    //     };

    //     return sendEmail({ optionsTransporter });
    //   }
    // });

    // Tunggu hingga semua email terkirim
    // await Promise.all(emailPromises);

    return res.status(200).send({
      message: "Successfully Publish Certificate!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.republish = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });
    const { programId, title, body, updatedBy } = req.body;

    if (!programId) throw { code: "400", errors: ["Program ID is required"] };

    const program = await publishProgram.findOne({
      include: [
        {
          model: publishParticipant,
        },
      ],
      where: { id: programId },
    });

    if (!program) throw { code: "400", errors: ["Record not found!"] };

    const payload = {
      programId: programId,
      title: title,
      body: body,
      createdBy: updatedBy || "System",
      updatedBy: updatedBy || "System",
    };
    const newData = await republishedHistory.create(payload);

    // program?.publishedParticipants.map(async (item) => {
    //   const rowItem = await publishParticipant.findOne({
    //     where: {
    //       id: item.id,
    //     },
    //   });

    //   // Send email to client
    //   const htmlBody = `
    //   <div><b>Yth. Bpk / Ibu ${rowItem?.lmsFullname}</b></div>
    //   <br />
    //   <div><b>Hal : <span style="color: #26D07C">${title}</span></b></div>
    //   <br />
    //   <div>Terima kasih sudah memilih prasmul-eli sebagai partner pengembangan skill anda.</div>
    //   <div>Adapun maksud kami mengirimkan email ini.</div>
    //   ${body}
    //   <div>Link <b>Achievements & Digital Certificate</b> terkait program di atas yang sudah kami perbarui.</div>
    //   <br />
    //   <table>
    //     <tr>
    //       <th style="text-align: left;">1. Link Achievements</th>
    //       <th>:</th>
    //       <th style="text-align: left;">${rowItem.linkAchievement}</th>
    //     </tr>
    //     <tr>
    //       <th style="text-align: left;">2. Link Certificate</th>
    //       <th>:</th>
    //       <th style="text-align: left;">${rowItem.linkCertificate}</th>
    //     </tr>
    //   </table>
    //   <br />
    //   <div>Demikian informasi ini kami sampaikan sampai bertemu di program pelatihan lainnya.</div>
    //   <br />
    //   <div>Salam Hormat,</div>
    //   <div><b><u>Program Support Prasmul ELI</u></b</div>
    //   <br />
    //   <br />
    //   <div style="color: #26D07C"><i>NB: Email terkirim otomatis oleh sistem.</i></div>
    //   `;

    //   const optionsTransporter = {
    //     from: `no-reply@prasmul-eli.co`,
    //     to: `< ${rowItem?.deliveryEmail} > `,
    //     cc: [],
    //     subject: title,
    //     html: htmlBody,
    //     attachments: [],
    //   };

    //   sendEmail({ optionsTransporter: optionsTransporter });
    // });

    return res.status(200).send({
      message: "Successfully Republish Certificate!",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.list = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;

    const limit = Number(10);
    const findDatas = await publishProgram.findAndCountAll({
      where: {
        [Op.or]: [{ lmsCourseName: { [Op.like]: `%${search || ""}%` } }],
        [Op.or]: [{ lmsCategoryName: { [Op.like]: `%${search || ""}%` } }],
      },
      include: [
        {
          model: certificate,
          attributes: {
            exclude: ["file"], // Exclude this field from the result
          },
          include: [
            {
              model: certificateTemplate,
              attributes: {
                exclude: ["file"], // Exclude this field from the result
              },
            },
          ],
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

exports.sendCertificate = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });
    const { participantIds } = req.body;

    if (participantIds.length === 0)
      throw { code: "400", errors: ["Participant ID is required"] };
    if (participantIds.length > 10)
      throw { code: "400", errors: ["Sent email max 10 participants"] };

    const participants = await publishParticipant.findAll({
      include: [
        {
          model: publishProgram,
        },
      ],
      where: {
        id: {
          [Op.or]: participantIds,
        },
      },
    });

    if (!participants) throw { code: "400", errors: ["Record not found!"] };
    const emailPromises = await participants.map(async (item) => {
      if (item) {
        const htmlBody = `
        <div><b>Yth. Bpk / Ibu ${item?.lmsFullname}</b></div>
        <br />
        <div><b>Hal : <span style="color: #26D07C">Digital Badge & Certification ${item?.publishProgram?.lmsCourseName}</span></b></div>
        <br />
        <div>Terima kasih sudah memilih prasmul-eli sebagai partner pengembangan skill anda.</div>
        <div>Bersama ini kami kirimkan link <b>Achievements & Digital Certificate</b> terkait program di atas.</div>
        <br />
        <table>
          <tr>
            <th style="text-align: left;">1. Link Achievements</th>
            <th>:</th>
            <th style="text-align: left;">${item.linkAchievement}</th>
          </tr>
          <tr>
            <th style="text-align: left;">2. Link Certificate</th>
            <th>:</th>
            <th style="text-align: left;">${item.linkCertificate}</th>
          </tr>
        </table>
        <br />
        <div>Demikian informasi ini kami sampaikan sampai bertemu di program pelatihan lainnya.</div>
        <br />
        <div>Salam Hormat,</div>
        <div><b><u>Program Support Prasmul ELI</u></b></div>
        <br />
        <br />
        <div style="color: #26D07C"><i>NB: Email terkirim otomatis oleh sistem.</i></div>
      `;

        const optionsTransporter = {
          from: `no-reply@prasmul-eli.co`,
          to: item.deliveryEmail,
          subject: `Prasmul ELI - Digital Badge & Certification ${item?.publishProgram?.lmsCourseName}`,
          html: htmlBody,
        };

        const payload = {
          statusSendEmailCertificate: "SENT",
        };
        publishParticipant.update(
          payload, // Update the status to 'Published'
          { where: { id: item.id } }
        );

        const payloadLog = {
          participantId: item.id,
          subject: `Prasmul ELI - Digital Badge & Certification ${item?.publishProgram?.lmsCourseName}`,
          createdBy: "System",
          updatedBy: "",
        };
        logsEmail.create(payloadLog);

        return sendEmail({ optionsTransporter });
      }
    });

    // Tunggu hingga semua email terkirim
    await Promise.all(emailPromises);
    return res.status(200).send({
      message: "Successfully Sent Certificate!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.resendCertificate = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });
    const { participantIds, programId } = req.body;

    if (participantIds.length === 0)
      throw { code: "400", errors: ["Participant ID is required"] };
    if (participantIds.length > 10)
      throw { code: "400", errors: ["Sent email max 10 participants"] };

    const findTitle = await republishedHistory.findOne({
      where: {
        programId: programId,
      },
    });
    if (!findTitle) throw { code: "400", errors: ["Title not found!"] };

    const participants = await publishParticipant.findAll({
      include: [
        {
          model: publishProgram,
        },
      ],
      where: {
        id: {
          [Op.or]: participantIds,
        },
      },
    });

    if (!participants) throw { code: "400", errors: ["Record not found!"] };
    const emailPromises = await participants.map(async (item) => {
      if (item) {
        const htmlBody = `
        <div><b>Yth. Bpk / Ibu ${item?.lmsFullname}</b></div>
        <br />
        <div><b>Hal : <span style="color: #26D07C">${findTitle?.title}</span></b></div>
        <br />
        <div>Terima kasih sudah memilih prasmul-eli sebagai partner pengembangan skill anda.</div>
        <div>Adapun maksud kami mengirimkan email ini.</div>
        ${findTitle?.body}
        <div>Link <b>Achievements & Digital Certificate</b> terkait program di atas yang sudah kami perbarui.</div>
        <br />
        <table>
          <tr>
            <th style="text-align: left;">1. Link Achievements</th>
            <th>:</th>
            <th style="text-align: left;">${item.linkAchievement}</th>
          </tr>
          <tr>
            <th style="text-align: left;">2. Link Certificate</th>
            <th>:</th>
            <th style="text-align: left;">${item.linkCertificate}</th>
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
          to: `< ${item?.deliveryEmail} > `,
          cc: [],
          subject: findTitle?.title,
          html: htmlBody,
          attachments: [],
        };

        const payloadLog = {
          participantId: item.id,
          subject: findTitle?.title,
          createdBy: "System",
          updatedBy: "",
        };
        logsEmail.create(payloadLog);

        return sendEmail({ optionsTransporter });
      }
    });

    // Tunggu hingga semua email terkirim
    await Promise.all(emailPromises);
    return res.status(200).send({
      message: "Successfully Resend Certificate!",
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
    const findData = await publishProgram.findAndCountAll({
      include: [
        {
          model: certificate,
          attributes: {
            exclude: ["file"], // Exclude this field from the result
          },
        },
      ],
      where: {
        status: statusPublish,
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

exports.searchByDate = async (req, res) => {
  try {
    const whereClause = {};
    const { startDate, endDate, courseName } = req.body;

    if (!startDate) throw { code: "400", errors: ["Start date is required"] };
    if (!endDate) throw { code: "400", errors: ["End date is required"] };

    whereClause.startDate = {
      [Op.between]: [startDate, endDate],
    };

    if (courseName !== null) {
      [{ lmsCourseName: { [Op.like]: `%${courseName || ""}%` } }];
    }

    const findDatas = await publishProgram.findAll({
      where: whereClause,
      include: [
        {
          model: certificate,
          attributes: {
            exclude: ["file"], // Exclude this field from the result
          },
          include: [
            {
              model: certificateTemplate,
              attributes: {
                exclude: ["file"], // Exclude this field from the result
              },
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      code: "200",
      status: "OK",
      data: findDatas,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
