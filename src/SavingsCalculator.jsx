// SavingsCalculator.js
import React, { useState } from "react";

function SavingsCalculator() {
  const [startingCapital, setStartingCapital] = useState(0);
  const [yearlyInterestRate, setYearlyInterestRate] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [durationYears, setDurationYears] = useState(0);
  const [taxRate, setTaxRate] = useState("");
  const [yearlyInflationRate, setYearlyInflationRate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [response, setResponse] = useState(null);

  const isValid = startingCapital && yearlyInterestRate && monthlyContribution && durationYears && taxRate && yearlyInflationRate && startDate;

  const handleSubmit = async () => {
    const payload = {
      startingCapital: Math.round(parseFloat(startingCapital) * 100), // convert to cents
      yearlyInterestRate: yearlyInterestRate,
      monthlyContribution: Math.round(parseFloat(monthlyContribution) * 100),
      durationYears: Number(durationYears),
      taxRate: taxRate,
      yearlyInflationRate: yearlyInflationRate,
      startDate: startDate
    };
    
    try {
      console.log(payload)
      const res = await fetch("http://localhost:8080/app/savings/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div>
      {
      <div>
        <h2>Savings Calculator</h2>
        <div>
          <label>Enter your starting balance:</label>
        </div>
        <div>
          <input type="number" step="1000" placeholder="Starting Balance" value={startingCapital} onChange={(e) => setStartingCapital(e.target.value)} />
        </div>
        <div>
          <label>Enter the yearly interest rate on your account (APY):</label>
        </div>
        <div>
          <input type="text" placeholder="Yearly Interest Rate" value={yearlyInterestRate} onChange={(e) => setYearlyInterestRate(e.target.value)} />
        </div>
        <div>
          <label>Enter the monthly contribution you will make:</label>
        </div>
        <div>
          <input type="number" placeholder="Monthly Contribution" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} />
        </div>
        <div>
          <label>Enter the term (or how many years to calculate)</label>
        </div>
        <div>
          <input type="number" step="1" placeholder="Duration (in years)" value={durationYears} onChange={(e) => setDurationYears(e.target.value)} />
        </div>
        <div>
          <label>Enter the income tax rate (or leave blank if none applies)</label>
        </div>
        <div>
          <input type="text" placeholder="Income tax rate" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
        </div>
        <div>
          <label>Enter the yearly inflation rate (or leave blank)</label>
        </div>
        <div>
          <input type="text" placeholder="Yearly inflation rate" value={yearlyInflationRate} onChange={(e) => setYearlyInflationRate(e.target.value)} />
        </div>
        <div>
          <label>Enter the start date</label>
        </div>
        <div>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
          <button disabled={!isValid} onClick={handleSubmit}>Submit</button>
      </div>
      }
      {response && (
      <div style={{ marginTop: "20px" }}>
        <h3>Savings Plan</h3>
        <p>Your monthly interest rate is: {response.monthlyInterestRate}.</p>
        <p>At the end of the term, you will have earned ${response.totalEarnings/100} in interest.</p>
        <p>Which represents a {response.rateOfReturn}% return.</p>
        <p>Adjusted to a {yearlyInterestRate}% yearly inflation, your return is {response.inflationAdjustedROR}%.</p>

        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Date</th>
              <th>Interest</th>
              <th>Tax</th>
              <th>Contribution</th>
              <th>Balance Increase</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {response.plan.map((row, idx) => (
              <tr key={idx}>
                <td>{new Date(row.date).toLocaleDateString()}</td>
                <td>${row.interest/100}</td>
                <td>${row.tax/100}</td>
                <td>${row.contribution/100}</td>
                <td>${row.increase/100}</td>
                <td>${row.capital/100}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    </div>
  );
}

export default SavingsCalculator;