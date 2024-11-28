const Sequelize = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "publishedParticipant",
    {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      lmsUserId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      programId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      lmsFullname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nameOnCertificate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      certificateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lmsEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deliveryEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      statusGraduation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      linkAchievement: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      linkProfileBadge: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      linkCertificate: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      lmsLinkedin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lmsProfilePicture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lmsDepartment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lmsPhone1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lmsPhone2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lmsAddress: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      lmsCompany: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lmsBioDecription: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      statusSendEmailCertificate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      slug1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug2: {
        type: Sequelize.STRING,
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
      tableName: "published_participants",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "programId",
          using: "BTREE",
          fields: [{ name: "programId" }],
        },
      ],
    }
  );
};
