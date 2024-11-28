const Sequelize = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "badge",
    {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      badgeFile: {
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
      tableName: "badges",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
