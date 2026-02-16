// LoanCalculator.js
import React, { useState } from "react";

function LoanCalculator() {
  const [startingPrincipal, setStartingPrincipal] = useState(0);
  const [yearlyInterestRate, setYearlyInterestRate] = useState("");
  const [monthlyPayment, setMOnthlyPayment] = useState(0);
  const [escrowPayment, setEscrowPayment] = useState(0);
  const [startDate, setStartDate] = useState("");
    const [response, setResponse] = useState(null);

  const isValid = startingPrincipal && yearlyInterestRate && monthlyPayment && escrowPayment && startDate;

  const handleSubmit = async () => {
    const payload = {
      startingPrincipal: Math.round(parseFloat(startingPrincipal) * 100), // convert to cents
      yearlyInterestRate, // keep as string
      monthlyPayment: Math.round(parseFloat(monthlyPayment) * 100),
      escrowPayment: Math.round(parseFloat(escrowPayment) * 100),
      startDate: startDate
    };
    
    try {
      console.log(payload)
      const res = await fetch("http://localhost:8080/app/loans/calculate", {
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
      {<div>
        <h2>Loan Calculator</h2>
        <div>
          <label>Enter the starting principal:</label>
        </div>
        <div>
          <input type="number" step="1000" placeholder="Starting Principal" value={startingPrincipal} onChange={(e) => setStartingPrincipal(e.target.value)} />
        </div>
        <div>
          <label>Enter the interest rate (APR):</label>
        </div>
        <div>
          <input type="text" placeholder="Interest Rate (APR)" value={yearlyInterestRate} onChange={(e) => setYearlyInterestRate(e.target.value)} />
        </div>
        <div>
          <label>Enter the monthly payments you will make:</label>
        </div>
        <div>
          <input type="number" placeholder="Monthly Payment" value={monthlyPayment} onChange={(e) => setMOnthlyPayment(e.target.value)} />
        </div>
        <div>
          <label>Enter the total amount of additional monthly payments (insurance, fees, etc.):</label>
        </div>
        <div>
          <input type="number" placeholder="Other Payments" value={escrowPayment} onChange={(e) => setEscrowPayment(e.target.value)} />
        </div>
        <div>
          <label>Enter the start date of the loan:</label>
        </div>
        <div>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <button disabled={!isValid} onClick={handleSubmit}>Submit</button>
      </div>}
      {response && (
          <div style={{ marginTop: "20px" }}>
            <h3>Payment Plan</h3>
            <p>Your loan will be paid after {response.durationMonths} months ({response.durationMonths/12} years).</p>
            <p>You will have paid a total of ${response.totalPaid/100}.</p>
            <p>You will have spent a total of ${response.totalExpenditure/100} in interest and other expenditures.</p>
            <p>Your cost of credit was {response.costOfCreditPercent}%.</p>

            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Interest Paid</th>
                  <th>Escrow Payment</th>
                  <th>Paydown</th>
                  <th>Principal</th>
                </tr>
              </thead>
              <tbody>
                {response.plan.map((row, idx) => (
                  <tr key={idx}>
                    <td>{new Date(row.date).toLocaleDateString()}</td>
                    <td>${row.payment/100}</td>
                    <td>${row.interest/100}</td>
                    <td>${row.escrowPayment/100}</td>
                    <td>${row.paydown/100}</td>
                    <td>${row.principal/100}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
}

export default LoanCalculator;