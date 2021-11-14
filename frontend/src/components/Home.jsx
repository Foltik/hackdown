import React from "react";
import Start from "./Start";
import Matches from "./Matches";

import FadeInComponent from "./FadeInComponent";

const Home = () => {
  const [state, setState] = React.useState(0);
  const [showComponent, setShowComponent] = React.useState(false);
  const [skills, setSkills] = React.useState(null);
  const [companies, setCompanies] = React.useState([]);
  const [companyNames, setCompanyNames] = React.useState([]);
  const [matchPercentages, setMatchPercentages] = React.useState(null);
  React.useEffect(() => {
    if (state === 0)
      setTimeout(() => {
        console.log("timeout");
        setShowComponent(true);
      }, 400);
  }, [state]);

  const hideComponent = () => {
    setShowComponent(false);
  };

  const loadMatchResults = (data) => {
    setCompanies(data.companies.map((item) => item.companyKey));
    setCompanyNames(data.companies.map((item) => item.companyName));
    const skills = {};
    data.companies.forEach((item) => (skills[item.companyKey] = item.skills));
    const matchPercentage = {};
    data.companies.forEach(
      (item) => (matchPercentage[item.companyKey] = item.matchPercentage)
    );
    setMatchPercentages(matchPercentage);
    setSkills(skills);
    setState(state + 1);
    setShowComponent(true);
  };

  const loadSummary = () => {
    setShowComponent(true);
  };
  const components = {
    0: (
      <Start
        triggerUnload={hideComponent}
        triggerNextComponent={loadMatchResults}
      />
    ),
    1: (
      <Matches
        names={companyNames}
        matches={companies}
        skills={skills}
        triggerUnload={hideComponent}
        triggerNextComponent={loadSummary}
        percentMatch={matchPercentages}
      />
    ),
  };

  return (
    <FadeInComponent showComponent={showComponent} duration={1000}>
      {components[state]}
    </FadeInComponent>
  );
};

export default Home;
