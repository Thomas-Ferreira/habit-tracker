import { Route, Routes } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/PrivateRoute'

function App() {

  const { token } = useAuth()

  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/dashboard' element={
        <ProtectedRoute token={token}>
          <DashboardPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
