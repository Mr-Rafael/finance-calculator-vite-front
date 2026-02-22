// SavingsCalculator.js
import React, { useState } from 'react'
import Button from './components/Button'
import InputLabel from './components/InputLabel'
import AmountInput from './components/AmountInput'
import RateInput from './components/RateInput'

function SavingsCalculator () {
  const [startingCapital, setStartingCapital] = useState(0)
  const [yearlyInterestRate, setYearlyInterestRate] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState(0)
  const [durationYears, setDurationYears] = useState(0)
  const [taxRate, setTaxRate] = useState('')
  const [yearlyInflationRate, setYearlyInflationRate] = useState('')
  const [startDate, setStartDate] = useState('')

  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)

  const isValid =
    startingCapital &&
    yearlyInterestRate &&
    monthlyContribution &&
    durationYears &&
    taxRate &&
    yearlyInflationRate &&
    startDate

  const handleSubmit = async e => {
    e.preventDefault()
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
      setLoading(true)
      setError(null)
      setResponse(null)
      console.log(payload)
      const res = await fetch('http://localhost:8080/app/savings/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Request failed')
      }
      setResponse(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full'>
      {
        <main className='w-full'>
          <section className='max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>
              Savings Calculator
            </h2>
            <form>
              <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1'>
                <div>
                  <InputLabel>Enter your starting balance:</InputLabel>
                  <AmountInput
                    type='number'
                    step='1000'
                    placeholder='Starting Balance'
                    value={startingCapital}
                    onChange={e => setStartingCapital(e.target.value)}
                    className='w-full border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <InputLabel>
                    Enter the yearly interest rate on your account (APY):
                  </InputLabel>
                  <input
                    type='text'
                    placeholder='Yearly Interest Rate'
                    value={yearlyInterestRate}
                    onChange={e => setYearlyInterestRate(e.target.value)}
                    className='w-full border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <InputLabel>
                    Enter the monthly contribution you will make:
                  </InputLabel>
                  <AmountInput
                    type='number'
                    placeholder='Monthly Contribution'
                    value={monthlyContribution}
                    onChange={e => setMonthlyContribution(e.target.value)}
                    className='w-full border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <InputLabel>
                    Enter the term (or how many years to calculate)
                  </InputLabel>
                  <AmountInput
                    type='number'
                    step='1'
                    placeholder='Duration (in years)'
                    value={durationYears}
                    onChange={e => setDurationYears(e.target.value)}
                    className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <InputLabel>
                    Enter the income tax rate (or leave blank if none applies)
                  </InputLabel>
                  <input
                    type='text'
                    placeholder='Income tax rate'
                    value={taxRate}
                    onChange={e => setTaxRate(e.target.value)}
                    className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <InputLabel>
                    Enter the yearly inflation rate (or leave blank)
                  </InputLabel>
                  <input
                    type='text'
                    placeholder='Yearly inflation rate'
                    value={yearlyInflationRate}
                    onChange={e => setYearlyInflationRate(e.target.value)}
                    className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <InputLabel>Enter the start date</InputLabel>
                  <input
                    type='date'
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>
              <div className='flex justify-end mt-6'>
                <Button
                  disabled={!isValid}
                  type='button'
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </form>
          </section>
        </main>
      }
      {loading && <h3>Generating your savings plan...</h3>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {response && (
        <section className='container px-4 mx-auto'>
          <div className='mt-6'>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              Savings Plan
            </h3>
            <p>
              Your monthly interest rate is:{' '}
              <b>{response.monthlyInterestRate}</b>.
            </p>
            <p>
              At the end of the term, you will have earned{' '}
              <b>${response.totalEarnings / 100}</b> in interest.
            </p>
            <p>
              Which represents a <b>{response.rateOfReturn}</b>% return.
            </p>
            <p>
              Adjusted to a <b>{yearlyInflationRate}%</b> yearly inflation, your
              return is <b>{response.inflationAdjustedROR}</b>%.
            </p>
            <div className='flex flex-col mt-6'>
              <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
                  <div className='overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                      <thead className='bg-gray-50 dark:bg-gray-800'>
                        <tr>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Date
                          </th>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Interest
                          </th>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Tax
                          </th>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Contribution
                          </th>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Balance Increase
                          </th>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900'>
                        {response.plan.map((row, idx) => (
                          <tr key={idx}>
                            <td className='px-4 py-4 text-sm font-medium whitespace-nowrap'>
                              {new Date(row.date).toLocaleDateString()}
                            </td>
                            <td className='px-4 py-4 text-sm font-medium whitespace-nowrap'>
                              ${row.interest / 100}
                            </td>
                            <td className='px-4 py-4 text-sm font-medium whitespace-nowrap'>
                              ${row.tax / 100}
                            </td>
                            <td className='px-4 py-4 text-sm font-medium whitespace-nowrap'>
                              ${row.contribution / 100}
                            </td>
                            <td className='px-4 py-4 text-sm font-medium whitespace-nowrap'>
                              ${row.increase / 100}
                            </td>
                            <td className='px-4 py-4 text-sm font-medium whitespace-nowrap'>
                              <b>${row.capital / 100}</b>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default SavingsCalculator
