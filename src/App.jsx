// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoanCalculator from "./LoanCalculator";
import SavingsCalculator from "./SavingsCalculator";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <nav>
          <Link to="/loan" style={{ marginRight: "10px" }}>Loan Calculator</Link>
          <Link to="/savings">Savings Calculator</Link>
        </nav>

        <Routes>
          <Route path="/loan" element={<LoanCalculator />} />
          <Route path="/savings" element={<SavingsCalculator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;