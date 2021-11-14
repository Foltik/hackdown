import React from "react";
import { Card, Button } from "react-bootstrap";
import submitLinkedin from "../api/submitLinkedin";
import submitResumeAPI from "../api/submitResume";
import FadeInComponent from "./FadeInComponent";

const Start = ({ triggerUnload, triggerNextComponent }) => {
  const [resumeFile, setResumeFile] = React.useState(null);
  const [profileLink, setProfileLink] = React.useState("");

  const [showTitle, setShowTitle] = React.useState(false);
  const [showDesc, setShowDesc] = React.useState(false);
  const [showFormOne, setShowFormOne] = React.useState(false);
  const [showFormTwo, setShowFormTwo] = React.useState(false);

  setTimeout(() => setShowTitle(true), 500);
  setTimeout(() => setShowDesc(true), 1000);
  setTimeout(() => setShowFormOne(true), 1500);
  setTimeout(() => setShowFormTwo(true), 2000);

  const submitAction = async (type) => {
    triggerUnload();
    const data = await (type === "resume"
      ? submitResumeAPI(resumeFile)
      : submitLinkedin(profileLink));
    console.log("trigger");
    triggerNextComponent(data);
  };

  return (
    <div className="stage-one">
      <FadeInComponent showComponent={showTitle}>Title</FadeInComponent>
      <FadeInComponent showComponent={showDesc}>
        Long ass description
      </FadeInComponent>
      <div className="form-container">
        <FadeInComponent showComponent={showFormOne}>
          <Card className="home-card">
            <Card.Body>
              <Card.Title>Submit your resume</Card.Title>
              <Card.Text>
                <input
                  type="file"
                  id="resume-upload"
                  onChange={(event) => setResumeFile(event.target.files[0])}
                />
              </Card.Text>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  submitAction("resume");
                }}
              >
                Submit Resume
              </Button>
            </Card.Body>
          </Card>
        </FadeInComponent>
        <FadeInComponent showComponent={showFormTwo}>
          <Card className="home-card">
            <Card.Body>
              <Card.Title>Provide a link to your Linkedin profile</Card.Title>
              <Card.Text>
                <input
                  type="text"
                  id="linkedin-profile"
                  onChange={(event) => setProfileLink(event.target.value)}
                />
              </Card.Text>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  submitAction("linkedin");
                }}
              >
                Submit Linkedin Profile
              </Button>
            </Card.Body>
          </Card>
        </FadeInComponent>
      </div>
    </div>
  );
};

export default Start;
