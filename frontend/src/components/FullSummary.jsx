import React, { useEffect } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import FadeInComponent from "./FadeInComponent";
import imageLogos from "../img/imageLogos";

const FullSummary = ({ companies, reviews, people }) => {
  const [currentCompany, setCurrentCompany] = React.useState(companies[0].name);
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showGraph, setShowGraph] = React.useState(7);
  // setShowGraph(7);

  console.log(currentCompany);

  useEffect(() => setTimeout(() => window.dostuff(), 1000), []);

  setTimeout(() => {
    setShowSidebar(true);
  }, 500);

  // setTimeout(() => {
  //   setShowGraph(showGraph + 1)
  // }, 200);

  return (
    <div className="comtainer">
      <FadeInComponent className="company-selector" showComponent={showSidebar}>
        <ButtonGroup vertical className="company-button-group">
          {companies.map((company) => {
            const companyName = company.name;
            const imageKey = companyName.toLowerCase();
            return (
              <Button
                variant='secondary'
                className="buton"
                key={companyName}
                onClick={() => {
                  console.log("ASDFAEWR", companyName);
                  setCurrentCompany(companyName);
                  window.companystuff(companyName);
                }}
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
      <FadeInComponent className="card-container" showComponent={!!showGraph}>
        <div className="chart-container">
          <div className="chart-row">
            <FadeInComponent showComponent={showGraph > 1}><div id="a" className="chart"></div></FadeInComponent>
            <FadeInComponent showComponent={showGraph > 2}><div id="b" className="chart">
                <span className="company-title">{currentCompany}</span>
                <span className="company-desc">
                {{
              'Amazon': `All Amazon teams and businesses, from Prime delivery to AWS, are guided by four key tenets: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking.

We are driven by the excitement of building technologies, inventing products, and providing services that transform the way our customers live their lives and run their businesses.
`,
              'Google': `Google is not a conventional company, and we don’t intend to become one. True, we share attributes with the world’s most successful organizations – a focus on innovation and smart business practices comes to mind – but even as we continue to grow, we’re committed to retaining a small-company feel. At Google, we know that every employee has something important to say, and that every employee is integral to our success. We provide individually-tailored compensation packages that can be comprised of competitive salary, bonus, and equity components, along with the opportunity to earn further financial bonuses and rewards.
`,
              'Salesforce': `Salesforce is the #1 CRM, bringing companies and customers together in the digital age. Founded in 1999, Salesforce enables companies of every size and industry to take advantage of powerful technologies—cloud, mobile, social, voice, and artificial intelligence—to connect to their customers in a whole new way. The Salesforce Customer 360 is an integrated CRM platform, powered by AI, that unites marketing, sales, commerce, IT and analytics departments. It gives these teams a single, shared view of their customers so they can work together to build lasting, trusted relationships and deliver the personalized experiences their customers expect.
`,
              'Netflix': `Netflix is the world's leading streaming entertainment service with 193 million paid memberships in over 190 countries enjoying TV series, documentaries and feature films across a wide variety of genres and languages. Members can watch as much as they want, anytime, anywhere, on any internet-connected screen. Members can play, pause and resume watching, all without commercials or commitments.
`,
              'Facebook': `The Facebook company is now Meta. Meta builds technologies that help people connect, find communities, and grow businesses. When Facebook launched in 2004, it changed the way people connect. Apps like Messenger, Instagram and WhatsApp further empowered billions around the world. Now, Meta is moving beyond 2D screens toward immersive experiences like augmented and virtual reality to help build the next evolution in social technology.
`,
            }[currentCompany]}</span></div></FadeInComponent>
            <FadeInComponent showComponent={showGraph > 3}><div id="c" className="chart"></div></FadeInComponent>
          </div>
          <div className="chart-row">
            <FadeInComponent showComponent={showGraph > 4}><div id="d" className="chart"><span>Degrees</span></div></FadeInComponent>
            <FadeInComponent showComponent={showGraph > 5}><div id="e" className="chart"><span>Skills</span></div></FadeInComponent>
            <FadeInComponent showComponent={showGraph > 6}><div id="f" className="chart"><span>School</span></div></FadeInComponent>
          </div>
        </div>
      </FadeInComponent>
    </div>
  );
};

export default FullSummary;
