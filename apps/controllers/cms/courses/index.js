const db = require("../../../models");
// const { authenticateCmsJWT } = require('../../../middleware/AuthenticateCmsJwt/authenticateJwt');
const {
  getCourseByName,
  getEnrolledUsersByCourseId,
} = require("../../../helpers");
const publishProgram = db.publishedProgram;

require("dotenv").config();

exports.searchCourse = async (req, res) => {
  try {
    // const cek = await authenticateCmsJWT(req.headers.authorization);
    // if (cek.login === false) return res.status(500).send({ message: `${cek.data} !` });
    const { courseName } = req.body;

    if (!courseName) throw { code: "400", errors: ["Course Name is required"] };

    const courses = await getCourseByName(courseName);
    if (courses.code === 400)
      throw { code: "400", errors: ["Error fetch Courses from Moodle!"] };

    if (courses?.res?.data?.total > 1) {
      throw {
        code: "400",
        errors: [
          "Hasil pencarian lebih dari satu Course, Gunakan Course Name lebih spesifik!",
        ],
      };
    }

    const findData = await publishProgram.findOne({
      where: { lmsCourseId: courses?.res?.data?.courses[0]?.id },
    });
    if (findData)
      throw {
        code: "400",
        errors: [
          "Course sudah pernah ditambahkan, Silahkan check pada menu Published Programs!",
        ],
      };

    const courseId = courses?.res?.data?.courses[0]?.id;
    const enrolledUsers = await getEnrolledUsersByCourseId(courseId);
    if (enrolledUsers.code === 400)
      throw { code: "400", errors: ["Error fetch Students from Moodle!"] };
    let students = null;
    if (enrolledUsers?.res?.data.length > 0) {
      // Filter users only students and not include for Program Assistant
      students = enrolledUsers?.res?.data.filter(
        (user) =>
          user.roles[0].shortname === "student" &&
          user.username !== "programassistant@prasmul-eli.co"
      );
    }

    res.status(200).json({
      code: "200",
      status: "OK",
      data: {
        course: courses?.res?.data?.courses[0],
        students: students,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
