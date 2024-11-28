const db = require("../../../models");
const certificateTemplate = db.certificateTemplate;
const certificate = db.certificate;
const { Op } = require("sequelize");
// const { authenticateCmsJWT } = require('../../../middleware/AuthenticateCmsJwt/authenticateJwt');

require("dotenv").config();

exports.create = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false)
    //   return res.status(500).send({ message: `${cek.data} !` });
    const { label, file, createdBy } = req.body;

    if (!label) throw { code: "400", errors: ["Label is required"] };
    if (!file)
      throw { code: "400", errors: ["Certificate Template is required"] };

    const findData = await certificateTemplate.findOne({
      where: { label },
    });

    if (findData) {
      return res.status(400).send({ message: "Label is Exist!" });
    }

    const payload = {
      label: label,
      file: file,
      createdBy: createdBy || "System",
      updatedBy: "",
    };
    const newData = await certificateTemplate.create(payload);
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

    const { label, file, updatedBy } = req.body;

    if (!label) throw { code: "400", errors: ["Label is required"] };
    if (!file)
      throw { code: "400", errors: ["Certificate Template is required"] };

    const cekData = await certificateTemplate.findOne({
      where: { id: req.params.id },
    });
    if (!cekData) return res.status(400).send({ message: "Record not found!" });

    const payload = {
      label: label,
      file: file,
      updatedBy: updatedBy,
    };
    await certificateTemplate.update(payload, { where: { id: req.params.id } });
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

    const dataCek = await certificateTemplate.findOne({
      where: { id: req.params.id },
    });
    if (!dataCek) return res.status(400).send({ message: "Record not found!" });
    await certificateTemplate.destroy({ where: { id: dataCek.id } });
    return res.status(200).send({ message: "Successfully deleted record!" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.show = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });

    const data = await certificateTemplate.findOne({
      include: [
        {
          model: certificate,
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
    const findDatas = await certificateTemplate.findAndCountAll({
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

exports.all = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });

    const data = await certificateTemplate.findAll();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
