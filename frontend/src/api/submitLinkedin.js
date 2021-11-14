import axios from "axios";
import fakeSkillMatchResponse from "../fakeResponses/skillMatchResponse";

const submitLinkedin = async (profileURL) => {
  await new Promise((res) => setTimeout(() => res(), 3000));
  return fakeSkillMatchResponse.data;

  const { data } = await axios.post("linkedin", {
    profileURL,
  });
  return fakeSkillMatchResponse.data;
};

export default submitLinkedin;
