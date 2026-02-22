// LoanCalculator.js
import React, { useState } from 'react'
import Button from './components/Button'
import InputLabel from './components/InputLabel'
import AmountInput from './components/AmountInput'
import RateInput from './components/RateInput'

function LoanCalculator () {
  const [startingPrincipal, setStartingPrincipal] = useState(0)
  const [yearlyInterestRate, setYearlyInterestRate] = useState('')
  const [monthlyPayment, setMOnthlyPayment] = useState(0)
  const [escrowPayment, setEscrowPayment] = useState(0)
  const [startDate, setStartDate] = useState('')

  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)

  const isValid =
    startingPrincipal &&
    yearlyInterestRate &&
    monthlyPayment &&
    escrowPayment &&
    startDate

  const handleSubmit = async e => {
    e.preventDefault()
    const payload = {
      startingPrincipal: Math.round(parseFloat(startingPrincipal) * 100), // convert to cents
      yearlyInterestRate, // keep as string
      monthlyPayment: Math.round(parseFloat(monthlyPayment) * 100),
      escrowPayment: Math.round(parseFloat(escrowPayment) * 100),
      startDate: startDate
    }

    try {
      setLoading(true)
      setError(null)
      setResponse(null)
      console.log(payload)
      const res = await fetch('http://localhost:8080/app/loans/calculate', {
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
              Loan Calculator
            </h2>
            <form>
              <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1'>
                <div>
                  <InputLabel>Enter the starting principal:</InputLabel>
                  <AmountInput
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
                  <RateInput
                    type='text'
                    placeholder='Interest Rate (APR)'
                    value={yearlyInterestRate}
                    onChange={e => setYearlyInterestRate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Enter the monthly payments you will make:</label>
                  <AmountInput
                    type='number'
                    placeholder='Monthly Payment'
                    value={monthlyPayment}
                    onChange={e => setMOnthlyPayment(e.target.value)}
                    className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label>
                    Enter the total amount of additional monthly payments
                    (insurance, fees, etc.):
                  </label>
                  <AmountInput
                    type='number'
                    placeholder='Other Payments'
                    value={escrowPayment}
                    onChange={e => setEscrowPayment(e.target.value)}
                    className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label>Enter the start date of the loan:</label>
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
      {loading && <h3>Generating your payment plan...</h3>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {response && (
        <section className='container px-4 mx-auto'>
          <div className='mt-6'>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              Payment Plan
            </h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-300'>
              Your loan will be paid after <b>{response.durationMonths}</b>{' '}
              months ({response.durationMonths / 12} years).
            </p>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-300'>
              You will have paid a total of <b>${response.totalPaid / 100}</b>.
            </p>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-300'>
              You will have spent a total of{' '}
              <b>${response.totalExpenditure / 100}</b> in interest and other
              expenditures.
            </p>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-300'>
              Your cost of credit was <b>{response.costOfCreditPercent}%</b>.
            </p>
            <div className='flex flex-col mt-6'>
              <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
                  <div className='overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg'>
                    <table className='w-full border-collapse border rounded overflow-hidden'>
                      <thead className='bg-gray-50 dark:bg-gray-800'>
                        <tr className='bg-gray-100'>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Date
                          </th>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Payment
                          </th>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Interest Paid
                          </th>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Escrow Payment
                          </th>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Paydown
                          </th>
                          <th className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Principal
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
                              ${row.payment / 100}
                            </td>
                            <td className='px-4 py-4 text-sm font-medium whitespace-nowrap'>
                              ${row.interest / 100}
                            </td>
                            <td className='px-4 py-4 text-sm font-medium whitespace-nowrap'>
                              ${row.escrowPayment / 100}
                            </td>
                            <td className='px-4 py-4 text-sm font-medium whitespace-nowrap'>
                              ${row.paydown / 100}
                            </td>
                            <td className='px-4 py-4 text-sm font-medium whitespace-nowrap'>
                              <b>${row.principal / 100}</b>
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

export default LoanCalculator
