import axios from "axios";

const postData = async (h) => {
  console.log("h: ", h);
  try {
    const response = await axios.post("http://localhost:3000/search-similar", {
      questionText: h,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export default postData;
