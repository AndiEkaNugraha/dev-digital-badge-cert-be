const Sequelize = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "republishedHistory",
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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT("long"),
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
      tableName: "republished_histories",
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
