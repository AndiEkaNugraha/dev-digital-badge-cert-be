const axios = require("axios");

async function getCourseByName(courseName) {
  try {
    let url = "https://lms.prasmul-eli.co/webservice/rest/server.php";
    let wstoken = "d101f08b7c2c28d4954ed73292d62707";
    let wsfunction = "core_course_search_courses";
    let moodlewsrestformat = "json";
    let criterianame = "search";
    const response = await axios.get(
      `${url}?wstoken=${wstoken}&wsfunction=${wsfunction}&moodlewsrestformat=${moodlewsrestformat}&criterianame=${criterianame}&criteriavalue=${courseName}`
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

module.exports = getCourseByName;
