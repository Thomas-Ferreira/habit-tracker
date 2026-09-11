import { Route, Routes } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/PrivateRoute'
import { Loading } from './common/loading'

function App() {

  const { token, isLoading } = useAuth()

  if (isLoading) return <Loading />

  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute token={token}>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  )
}

export default App
