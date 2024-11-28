const db = require("../../../models");
const certificate = db.certificate;
const badge = db.badge;
const certificateTemplate = db.certificateTemplate;
const { Op } = require("sequelize");
// const { authenticateCmsJWT } = require('../../../middleware/AuthenticateCmsJwt/authenticateJwt');

require("dotenv").config();

exports.create = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false)
    //   return res.status(500).send({ message: `${cek.data} !` });
    const {
      badgeId,
      certificateTemplateId,
      companyName,
      picName,
      picPosition,
      file,
      label,
      createdBy,
    } = req.body;

    // console.log(req.body);
    // return false;

    if (!badgeId) throw { code: "400", errors: ["Badge is required"] };
    if (!certificateTemplateId)
      throw { code: "400", errors: ["Template is required"] };
    if (!label) throw { code: "400", errors: ["Label is required"] };

    const findData = await certificate.findOne({
      where: { label },
    });

    if (findData) {
      return res.status(400).send({ message: "Label is Exist!" });
    }

    const payload = {
      badgeId: badgeId,
      certificateTemplateId: certificateTemplateId,
      companyName: companyName,
      picName: picName,
      picPosition: picPosition,
      file: file,
      label: label,
      createdBy: createdBy || "System",
      updatedBy: "",
    };
    const newData = await certificate.create(payload);
    return res.status(200).send({
      message: "Successfully new record!",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Server mengalami gangguan !", error });
  }
};

exports.update = async (req, res) => {
  try {
    //   const cek = await authenticateCmsJWT(req.headers.authorization);
    //   if (cek.login === false)
    //     return res.status(500).send({ message: `${cek.data} !` });

    const {
      badgeId,
      certificateTemplateId,
      companyName,
      picName,
      picPosition,
      file,
      label,
      updatedBy,
    } = req.body;

    if (!badgeId) throw { code: "400", errors: ["Badge is required"] };
    if (!certificateTemplateId)
      throw { code: "400", errors: ["Template is required"] };
    if (!label) throw { code: "400", errors: ["Label is required"] };

    const cekData = await certificate.findOne({
      where: { id: req.params.id },
    });
    if (!cekData) return res.status(400).send({ message: "Record not found!" });

    const payload = {
      badgeId: badgeId,
      certificateTemplateId: certificateTemplateId,
      companyName: companyName,
      picName: picName,
      picPosition: picPosition,
      file: file,
      label: label,
      updatedBy: updatedBy,
    };
    await certificate.update(payload, { where: { id: req.params.id } });
    return res.status(200).send({
      message: "Successfully updated record!",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.delete = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false)
    //   return res.status(500).send({ message: `${cek.data} !` });

    const dataCek = await certificate.findOne({
      where: { id: req.params.id },
    });
    if (!dataCek) return res.status(400).send({ message: "Record not found!" });
    await certificate.destroy({ where: { id: dataCek.id } });
    return res.status(200).send({ message: "Successfully deleted record!" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.show = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });

    const data = await certificate.findOne({
      include: [
        {
          model: badge,
        },
        {
          model: certificateTemplate,
        },
      ],
      where: { id: req.params.id },
    });
    if (!data)
      return res.status(400).send({ message: "Record not found!", error });
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.list = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;

    const limit = Number(10);
    const findDatas = await certificate.findAndCountAll({
      where: {
        [Op.or]: [{ label: { [Op.like]: `%${search || ""}%` } }],
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
