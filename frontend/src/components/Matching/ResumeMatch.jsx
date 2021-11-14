import React from "react";
import submitResumeAPI from "../../api/submitResume";
import { useNavigate } from "react-router-dom";

const ResumeMatch = () => {
  const [resumeFile, setResumeFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const submitResume = async () => {
    setLoading(true);
    if (resumeFile) {
      console.log(resumeFile);
      const resultID = await submitResumeAPI(resumeFile);
      navigate(`/match/${resultID}`);
    }
    setLoading(false);
  };
  return (
    <div>
      <h2>Resume Matching</h2>
      <h3>
        Upload your resume here and we'll determine some companies who have the
        same skills as you!
      </h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form>
          <label for="resume-upload">Upload your resume:</label>
          <input
            id="resume-upload"
            type="file"
            onChange={(event) => setResumeFile(event.target.files[0])}
            accept=".pdf"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              submitResume();
            }}
          >
            Submit Resume
          </button>
        </form>
      )}
    </div>
  );
};

export default ResumeMatch;
