// App.js
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Login from './Login'
import LoanCalculator from './LoanCalculator'
import SavingsCalculator from './SavingsCalculator'

function App () {
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
