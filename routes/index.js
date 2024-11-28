var express = require("express");
var router = express.Router();
const certificateTemplate = require("../apps/controllers/cms/certificate-templates");
const badge = require("../apps/controllers/cms/badges");
const skill = require("../apps/controllers/cms/skills");
const certificate = require("../apps/controllers/cms/certificates");
const course = require("../apps/controllers/cms/courses");
const publishedPrograms = require("../apps/controllers/cms/published-programs");
const publishedParticipants = require("../apps/controllers/cms/published-participants");
const programSkill = require("../apps/controllers/cms/maping-skills");
const logEmail = require("../apps/controllers/cms/log-emails");

const certificateUser = require("../apps/controllers/user/certificates");
const badgeUser = require("../apps/controllers/user/badges");
const version = require("../apps/controllers/version");

const { cacheMiddleware } = require("../apps/middleware/caching/cache");

// client certificates routing
router.get(
  "/user/certificate/:slugParticipant",
  certificateUser.listCertificate
);
router.get(
  "/user/certificate/show/:slugParticipant/:slugProgram",
  certificateUser.showCertificate
);

// client badges routing
router.get(
  "/user/badge/show/:slugProgram/:slugParticipant",
  badgeUser.showBadges
);

// cms program skill routing
router.get(
  "/cms/program-skill/show-by-category/:lmsCategoryId",
  programSkill.showByCategory
);

// cms published participant routing
router.get("/cms/published-participant/show/:id", publishedParticipants.show);
router.put("/cms/published-participant/:id", publishedParticipants.update);
router.post(
  "/cms/published-participant/delivery-email",
  publishedParticipants.updateDeliveryEmail
);
router.get("/cms/published-participant", publishedParticipants.list);
router.post(
  "/cms/published-participant/republish",
  publishedParticipants.republish
);
router.post(
  "/cms/published-participant/filter",
  publishedParticipants.filterData
);

// cms published program routing
router.post("/cms/published-program/save", publishedPrograms.save);
router.get("/cms/published-program/show/:id", publishedPrograms.show);
router.put("/cms/published-program/:id", publishedPrograms.update);
router.post("/cms/published-program/publish", publishedPrograms.publish);
router.post("/cms/published-program/republish", publishedPrograms.republish);
router.get("/cms/published-program", publishedPrograms.list);
router.post(
  "/cms/published-program/send-certificate",
  publishedPrograms.sendCertificate
);
router.post(
  "/cms/published-program/resend-certificate",
  publishedPrograms.resendCertificate
);
router.post("/cms/published-program/filter", publishedPrograms.filterData);
router.post(
  "/cms/published-program/searchByDate",
  publishedPrograms.searchByDate
);

// cms course routing
router.post("/cms/course/search", course.searchCourse);

// cms certificate routing
router.post("/cms/certificate", certificate.create);
router.get("/cms/certificate/show/:id", certificate.show);
router.get("/cms/certificate", certificate.list);
router.patch("/cms/certificate/:id", certificate.update);
router.delete("/cms/certificate/:id", certificate.delete);

// cms certificate template routing
router.post("/cms/certificate-template", certificateTemplate.create);
router.get("/cms/certificate-template/show/:id", certificateTemplate.show);
router.get("/cms/certificate-template", certificateTemplate.list);
router.get("/cms/certificate-template/all", certificateTemplate.all);
router.patch("/cms/certificate-template/:id", certificateTemplate.update);
router.delete("/cms/certificate-template/:id", certificateTemplate.delete);

// cms badge routing
router.post("/cms/badge", badge.create);
router.get("/cms/badge/show/:id", badge.show);
router.get("/cms/badge", badge.list);
router.get("/cms/badge/all", badge.all);
router.patch("/cms/badge/:id", badge.update);
router.delete("/cms/badge/:id", badge.delete);

// cms skill routing
router.post("/cms/skill", skill.create);
router.get("/cms/skill/show/:id", skill.show);
router.get("/cms/skill", skill.list);
router.get("/cms/skill/all", skill.all);
router.patch("/cms/skill/:id", skill.update);
router.delete("/cms/skill/:id", skill.delete);

// cms logs email routing
router.get("/cms/logs-email", logEmail.list);

router.get("/check-version", version.checkVersion);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
