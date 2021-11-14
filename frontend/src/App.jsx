import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import Summary from "./components/Summary/Summary";
import ResumeMatch from "./components/Matching/ResumeMatch";
import Home from "./components/Home";
import CompanySummary from "./components/Summary/CompanySummary";
import ResumeMatchResult from "./components/Matching/ResumeMatchResult";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
