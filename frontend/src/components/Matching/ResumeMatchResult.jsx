import React from "react";
import { useParams } from "react-router";

const ResumeMatchResult = () => {
  const { id } = useParams();
  return <div>Resume result for {id}</div>;
};

export default ResumeMatchResult;
