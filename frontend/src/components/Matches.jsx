import React from "react";
import { ButtonGroup, Button, Card, CardGroup } from "react-bootstrap";
import getFullSummaryData from "../api/fullSummary";
import imageLogos from "../img/imageLogos";
import FadeInComponent from "./FadeInComponent";

const CompanyCard = ({ companyName, matchPercentage, imageLogo, index }) => {
  const [showCard, setShowCard] = React.useState(false);
  setTimeout(() => setShowCard(true), 500 + (4 - index) * 1000);
  return (
    <FadeInComponent showComponent={showCard}>
      <Card className="company-card">
        <Card.Img
          className="company-card-logo"
          src={imageLogo}
          alt={`${companyName} logo`}
        />
        <Card.Body>
          <Card.Title>{companyName}</Card.Title>
          <Card.Text>{matchPercentage}% match</Card.Text>
        </Card.Body>
      </Card>
    </FadeInComponent>
  );
};

const Matches = ({
  names,
  matches,
  skills,
  percentMatch,
  triggerUnload,
  triggerNextComponent,
}) => {
  const seeMore = async () => {
    triggerUnload();
    const data = await getFullSummaryData();
    triggerNextComponent(data);
  };
  const [showTitle, setShowTitle] = React.useState(false);
  const [showNextButton, setShowNextButton] = React.useState(false);
  setTimeout(() => setShowTitle(true), 500);
  setTimeout(() => setShowNextButton(true), 6000);

  return (
    <div className="stage-two">
      <FadeInComponent showComponent={showTitle} className="matches-title">
        These are your top four matches:
      </FadeInComponent>
      <div className="card-container">
        {matches.map((company, index) => {
          return (
            <CompanyCard
              companyName={names[index]}
              matchPercentage={percentMatch[company]}
              imageLogo={imageLogos[company]}
              index={index}
            />
          );
        })}
      </div>
      <FadeInComponent showComponent={showNextButton}>
        <Button onClick={() => seeMore()} className="summary-button">
          Continue to full summary
        </Button>
      </FadeInComponent>
    </div>
  );
};

export default Matches;
/**
 * <ButtonGroup vertical className="matched-companies-container">
        {matches.map((item) => {
          return (
            <Button
              onClick={() => setCurrentSelection(item)}
              className={
                currentSelection === item ? "selected" : "not-selected"
              }
            >
              <img
                className="company-logo"
                src={imageLogos[item]}
                alt={`${item} logo`}
              />
            </Button>
          );
        })}
      </ButtonGroup>
      <div className="skills-container">
        <ul>
          {Object.entries(skills[currentSelection]).map(([key, value]) => (
            <li>{`${key} -- ${value}`}</li>
          ))}
        </ul>
        <button onClick={() => seeMore()}>See details</button>
      </div>
 */
