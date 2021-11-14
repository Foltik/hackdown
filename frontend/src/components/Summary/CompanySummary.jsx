import React from "react";
import { useParams } from "react-router";

const CompanySummary = () => {
  const { companyName } = useParams();
  return <div>Company summary for {companyName}</div>;
};

export default CompanySummary;
