const Sequelize = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "certificate",
    {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      badgeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      certificateTemplateId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      picName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      picPosition: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      file: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "certificates",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "badgeId",
          using: "BTREE",
          fields: [{ name: "badgeId" }],
        },
        {
          name: "certificateTemplateId",
          using: "BTREE",
          fields: [{ name: "certificateTemplateId" }],
        },
      ],
    }
  );
};
