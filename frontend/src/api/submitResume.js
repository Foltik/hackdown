import axios from "axios";
import fakeSkillMatchResponse from "../fakeResponses/skillMatchResponse";

const submitResume = async (resume) => {
  return fakeSkillMatchResponse.data;
  const formData = new FormData();
  formData.append("resume", resume);
  const { data } = await axios.post("resume8000", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return fakeSkillMatchResponse.data;
};

export default submitResume;
