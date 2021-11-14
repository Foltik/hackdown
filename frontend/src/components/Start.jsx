import React from "react";
import { Card, Button } from "react-bootstrap";
import submitLinkedin from "../api/submitLinkedin";
import submitResumeAPI from "../api/submitResume";
import FadeInComponent from "./FadeInComponent";
import matchbox from "../img/matchbox.png";

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
      <FadeInComponent className="home-title" showComponent={showTitle}>
        <div className="home-header">
          <img className="matchbox-logo" src={matchbox} />
          <div>Matchbox</div>
        </div>
      </FadeInComponent>
      <FadeInComponent showComponent={showDesc}>
        Welcome to Matchbox! This is a service that will match you with
        companies based on your skillsets. We have sourced company data across
        several sources such as Glassdoor and Linkedin to aggregate popular
        sentiment and valued skills at each company. To begin, please submit
        your resume or provide a link to your LinkedIn profile!
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
              <Button variant="outline-primary"
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
              <input
                type="text"
                id="linkedin-profile"
                onChange={(event) => setProfileLink(event.target.value)}
              />
              <Button variant="outline-primary"
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
