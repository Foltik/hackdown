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
      <Navbar bg="dark" variant="dark">
        <Container>
          <Nav>
            <Link to="/">Home</Link>
            <Link to="/summary">Summary</Link>
            <Link to="/match">Match</Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/summary/:companyName" element={<CompanySummary />} />

        <Route path="/summary" element={<Summary />}></Route>
        <Route path="/match/:id" element={<ResumeMatchResult />} />
        <Route path="/match" element={<ResumeMatch />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
