// LoanCalculator.js
import React, { useState } from 'react'

function LoanCalculator () {
  const [startingPrincipal, setStartingPrincipal] = useState(0)
  const [yearlyInterestRate, setYearlyInterestRate] = useState('')
  const [monthlyPayment, setMOnthlyPayment] = useState(0)
  const [escrowPayment, setEscrowPayment] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [response, setResponse] = useState(null)

  const isValid =
    startingPrincipal &&
    yearlyInterestRate &&
    monthlyPayment &&
    escrowPayment &&
    startDate

  const handleSubmit = async () => {
    const payload = {
      startingPrincipal: Math.round(parseFloat(startingPrincipal) * 100), // convert to cents
      yearlyInterestRate, // keep as string
      monthlyPayment: Math.round(parseFloat(monthlyPayment) * 100),
      escrowPayment: Math.round(parseFloat(escrowPayment) * 100),
      startDate: startDate
    }

    try {
      console.log(payload)
      const res = await fetch('http://localhost:8080/app/loans/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setResponse(data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div className='max-w-lg mx-auto p-6 bg-white shadow rounded'>
      {
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loan Calculator</h2>
          <div>
            <label>Enter the starting principal:</label>
          </div>
          <div>
            <input
              type='number'
              step='1000'
              placeholder='Starting Principal'
              value={startingPrincipal}
              onChange={e => setStartingPrincipal(e.target.value)}
              className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label>Enter the interest rate (APR):</label>
          </div>
          <div>
            <input
              type='text'
              placeholder='Interest Rate (APR)'
              value={yearlyInterestRate}
              onChange={e => setYearlyInterestRate(e.target.value)}
              className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label>Enter the monthly payments you will make:</label>
          </div>
          <div>
            <input
              type='number'
              placeholder='Monthly Payment'
              value={monthlyPayment}
              onChange={e => setMOnthlyPayment(e.target.value)}
              className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label>
              Enter the total amount of additional monthly payments (insurance,
              fees, etc.):
            </label>
          </div>
          <div>
            <input
              type='number'
              placeholder='Other Payments'
              value={escrowPayment}
              onChange={e => setEscrowPayment(e.target.value)}
              className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label>Enter the start date of the loan:</label>
          </div>
          <div>
            <input
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            disabled={!isValid}
            onClick={handleSubmit}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
          >
            Submit
          </button>
        </div>
      }
      {response && (
        <div className='mt-6'>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Payment Plan</h3>
          <p>
            Your loan will be paid after {response.durationMonths} months (
            {response.durationMonths / 12} years).
          </p>
          <p>You will have paid a total of ${response.totalPaid / 100}.</p>
          <p>
            You will have spent a total of ${response.totalExpenditure / 100} in
            interest and other expenditures.
          </p>
          <p>Your cost of credit was {response.costOfCreditPercent}%.</p>

          <table className='w-full border-collapse border rounded overflow-hidden'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2 text-left'>Date</th>
                <th className='border px-4 py-2 text-left'>Payment</th>
                <th className='border px-4 py-2 text-left'>Interest Paid</th>
                <th className='border px-4 py-2 text-left'>Escrow Payment</th>
                <th className='border px-4 py-2 text-left'>Paydown</th>
                <th className='border px-4 py-2 text-left'>Principal</th>
              </tr>
            </thead>
            <tbody>
              {response.plan.map((row, idx) => (
                <tr className='bg-gray-100' key={idx}>
                  <td className='border px-4 py-2 text-left'>
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className='border px-4 py-2 text-left'>
                    ${row.payment / 100}
                  </td>
                  <td className='border px-4 py-2 text-left'>
                    ${row.interest / 100}
                  </td>
                  <td className='border px-4 py-2 text-left'>
                    ${row.escrowPayment / 100}
                  </td>
                  <td className='border px-4 py-2 text-left'>
                    ${row.paydown / 100}
                  </td>
                  <td className='border px-4 py-2 text-left'>
                    ${row.principal / 100}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default LoanCalculator
