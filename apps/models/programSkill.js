const Sequelize = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "programSkill",
    {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      programId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      skillId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      lmsCategoryId: {
        type: Sequelize.BIGINT,
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
      tableName: "maping_program_skills",
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
        {
          name: "skillId",
          using: "BTREE",
          fields: [{ name: "skillId" }],
        },
      ],
    }
  );
};
