import axios from "axios";

const submitResume = async (resume) => {
  const formData = new FormData();
  formData.append("resume", resume);
  const { data } = await axios.post("resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return "00";
  return data.id;
};

export default submitResume;
