import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import FadeInComponent from "./FadeInComponent";
import imageLogos from "../img/imageLogos";

const FullSummary = ({ companies, reviews, people }) => {
  const [currentCompany, setCurrentCompany] = React.useState(companies[0].name);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showGraph, setShowGraph] = React.useState(false);
  console.log(currentCompany);
  setTimeout(() => {
    setShowSidebar(true);
  }, 500);

  setTimeout(() => {
    setShowGraph(true);
  }, 1250);

  return (
    <div>
      <FadeInComponent className="company-selector" showComponent={showSidebar}>
        <ButtonGroup vertical className="company-button-group">
          {companies.map((company) => {
            const companyName = company.name;
            const imageKey = companyName.toLowerCase();
            return (
              <Button
                key={companyName}
                onClick={() => setCurrentCompany(companyName)}
              >
                <img
                  className="selector-logo"
                  src={imageLogos[imageKey]}
                  alt={`${companyName} logo`}
                />
              </Button>
            );
          })}
        </ButtonGroup>
      </FadeInComponent>
      <FadeInComponent></FadeInComponent>
    </div>
  );
};

export default FullSummary;
