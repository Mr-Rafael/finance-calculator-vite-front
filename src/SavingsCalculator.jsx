// SavingsCalculator.js
import React, { useState } from 'react'

function SavingsCalculator () {
  const [startingCapital, setStartingCapital] = useState(0)
  const [yearlyInterestRate, setYearlyInterestRate] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState(0)
  const [durationYears, setDurationYears] = useState(0)
  const [taxRate, setTaxRate] = useState('')
  const [yearlyInflationRate, setYearlyInflationRate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [response, setResponse] = useState(null)

  const isValid =
    startingCapital &&
    yearlyInterestRate &&
    monthlyContribution &&
    durationYears &&
    taxRate &&
    yearlyInflationRate &&
    startDate

  const handleSubmit = async () => {
    const payload = {
      startingCapital: Math.round(parseFloat(startingCapital) * 100), // convert to cents
      yearlyInterestRate: yearlyInterestRate,
      monthlyContribution: Math.round(parseFloat(monthlyContribution) * 100),
      durationYears: Number(durationYears),
      taxRate: taxRate,
      yearlyInflationRate: yearlyInflationRate,
      startDate: startDate
    }

    try {
      console.log(payload)
      const res = await fetch('http://localhost:8080/app/savings/calculate', {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Savings Calculator</h2>
          <div>
            <label>Enter your starting balance:</label>
          </div>
          <div>
            <input
              type='number'
              step='1000'
              placeholder='Starting Balance'
              value={startingCapital}
              onChange={e => setStartingCapital(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Enter the yearly interest rate on your account (APY):</label>
          </div>
          <div>
            <input
              type='text'
              placeholder='Yearly Interest Rate'
              value={yearlyInterestRate}
              onChange={e => setYearlyInterestRate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Enter the monthly contribution you will make:</label>
          </div>
          <div>
            <input
              type='number'
              placeholder='Monthly Contribution'
              value={monthlyContribution}
              onChange={e => setMonthlyContribution(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label>Enter the term (or how many years to calculate)</label>
          </div>
          <div>
            <input
              type='number'
              step='1'
              placeholder='Duration (in years)'
              value={durationYears}
              onChange={e => setDurationYears(e.target.value)}
              className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label>
              Enter the income tax rate (or leave blank if none applies)
            </label>
          </div>
          <div>
            <input
              type='text'
              placeholder='Income tax rate'
              value={taxRate}
              onChange={e => setTaxRate(e.target.value)}
              className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label>Enter the yearly inflation rate (or leave blank)</label>
          </div>
          <div>
            <input
              type='text'
              placeholder='Yearly inflation rate'
              value={yearlyInflationRate}
              onChange={e => setYearlyInflationRate(e.target.value)}
              className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label>Enter the start date</label>
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Savings Plan</h3>
          <p>Your monthly interest rate is: {response.monthlyInterestRate}.</p>
          <p>
            At the end of the term, you will have earned $
            {response.totalEarnings / 100} in interest.
          </p>
          <p>Which represents a {response.rateOfReturn}% return.</p>
          <p>
            Adjusted to a {yearlyInflationRate}% yearly inflation, your return
            is {response.inflationAdjustedROR}%.
          </p>

          <table className='w-full border-collapse border rounded overflow-hidden'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2 text-left'>Date</th>
                <th className='border px-4 py-2 text-left'>Interest</th>
                <th className='border px-4 py-2 text-left'>Tax</th>
                <th className='border px-4 py-2 text-left'>Contribution</th>
                <th className='border px-4 py-2 text-left'>Balance Increase</th>
                <th className='border px-4 py-2 text-left'>Balance</th>
              </tr>
            </thead>
            <tbody>
              {response.plan.map((row, idx) => (
                <tr className='bg-gray-100' key={idx}>
                  <td className='border px-4 py-2 text-left'>
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className='border px-4 py-2 text-left'>
                    ${row.interest / 100}
                  </td>
                  <td className='border px-4 py-2 text-left'>
                    ${row.tax / 100}
                  </td>
                  <td className='border px-4 py-2 text-left'>
                    ${row.contribution / 100}
                  </td>
                  <td className='border px-4 py-2 text-left'>
                    ${row.increase / 100}
                  </td>
                  <td className='border px-4 py-2 text-left'>
                    ${row.capital / 100}
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

export default SavingsCalculator
