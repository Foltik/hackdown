import React from "react";
import { Link } from "react-router-dom";

const Summary = () => {
  const [companyInput, setCompanyInput] = React.useState("");

  return (
    <div>
      <h2>Company Sentiment Summary</h2>
      <form>
        <input
          type="text"
          placeholder="Type a company name..."
          onChange={(event) => setCompanyInput(event.target.value)}
        />
        <Link to={`${companyInput}`}>Search</Link>
      </form>
    </div>
  );
};

export default Summary;
