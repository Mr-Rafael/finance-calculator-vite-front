// App.js
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Login from './Login'
import LoanCalculator from './LoanCalculator'
import SavingsCalculator from './SavingsCalculator'
import { useEffect } from "react"

function App () {
  useEffect(() => {
    async function checkSession () {
      const res = await fetch('http://localhost:8080/refresh', {
        method: 'POST',
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('accessToken', data.access_token)
      } else {
        localStorage.removeItem('accessToken')
      }
    }

    checkSession()
  }, [])
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />

      <Route path='/login' element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path='/loan' element={<LoanCalculator />} />
        <Route path='/savings' element={<SavingsCalculator />} />
      </Route>
    </Routes>
  )
}

export default App
