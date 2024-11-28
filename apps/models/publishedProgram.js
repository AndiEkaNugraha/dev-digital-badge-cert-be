const Sequelize = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "publishProgram",
    {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      certificateId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      lmsCourseId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      lmsCategoryId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      lmsCourseName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lmsCategoryName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      publishDate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      startDate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiredDate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
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
      tableName: "published_programs",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "certificateId",
          using: "BTREE",
          fields: [{ name: "certificateId" }],
        },
      ],
    }
  );
};
