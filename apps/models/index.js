const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.PORT,
  dialectOptions: {
    // useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: true,
    timezone: "+07:00",
  },
  operatorsAliases: 0,
  timezone: "+07:00", //for writing to database
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// mapping table model
db.badge = require("./badge")(sequelize, Sequelize);
db.certificate = require("./certificate")(sequelize, Sequelize);
db.certificateCategory = require("./certificateCategory")(sequelize, Sequelize);
db.certificateTemplate = require("./certificateTemplate")(sequelize, Sequelize);
db.programSkill = require("./programSkill")(sequelize, Sequelize);
db.publishedParticipant = require("./publishedParticipant")(
  sequelize,
  Sequelize
);
db.publishedProgram = require("./publishedProgram")(sequelize, Sequelize);
db.republishedHistory = require("./republishedHistory")(sequelize, Sequelize);
db.skill = require("./skill")(sequelize, Sequelize);
db.logEmail = require("./logEmail")(sequelize, Sequelize);

// structure relation
db.badge.hasMany(db.certificate, { foreignKey: "badgeId" });
db.certificate.belongsTo(db.badge, { foreignKey: "badgeId" });

db.certificateTemplate.hasMany(db.certificate, {
  foreignKey: "certificateTemplateId",
});
db.certificate.belongsTo(db.certificateTemplate, {
  foreignKey: "certificateTemplateId",
});

db.certificate.hasMany(db.publishedProgram, {
  foreignKey: "certificateId",
});
db.publishedProgram.belongsTo(db.certificate, {
  foreignKey: "certificateId",
});

db.publishedProgram.hasMany(db.publishedParticipant, {
  foreignKey: "programId",
});
db.publishedParticipant.belongsTo(db.publishedProgram, {
  foreignKey: "programId",
});

db.publishedProgram.hasMany(db.republishedHistory, {
  foreignKey: "programId",
});
db.republishedHistory.belongsTo(db.publishedProgram, {
  foreignKey: "programId",
});

db.publishedProgram.hasMany(db.programSkill, {
  foreignKey: "programId",
});
db.programSkill.belongsTo(db.publishedProgram, {
  foreignKey: "programId",
});

db.skill.hasMany(db.programSkill, {
  foreignKey: "skillId",
});
db.programSkill.belongsTo(db.skill, {
  foreignKey: "skillId",
});

db.publishedParticipant.hasMany(db.logEmail, { foreignKey: "participantId" });
db.logEmail.belongsTo(db.publishedParticipant, { foreignKey: "participantId" });

module.exports = db;
