const axios = require("axios");

async function getEnrolledUsersByCourseId(courseId) {
  try {
    let url = "https://lms.prasmul-eli.co/webservice/rest/server.php";
    let wstoken = "d101f08b7c2c28d4954ed73292d62707";
    let wsfunction = "core_enrol_get_enrolled_users";
    let moodlewsrestformat = "json";
    const response = await axios.get(
      `${url}?wstoken=${wstoken}&wsfunction=${wsfunction}&moodlewsrestformat=${moodlewsrestformat}&courseid=${courseId}`
    );
    return {
      code: 200,
      res: response,
    };
  } catch (error) {
    return {
      code: 400,
      res: [],
    };
  }
}

module.exports = getEnrolledUsersByCourseId;
