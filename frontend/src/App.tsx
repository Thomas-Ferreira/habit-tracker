import { Route, Routes } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { HabitsPage } from './pages/HabitsPage'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/PrivateRoute'
import { Loading } from './common/loading'
import { DashboardPage } from './pages/DashboardPage'
import { ErrorPage } from './pages/ErrorPage'
import { Layout } from './components/layout'

function App() {

  const { token, isLoading } = useAuth()

  if (isLoading) return <Loading />

  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute token={token}>
          <Layout>
            <HabitsPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute token={token}>
          <Layout>
            <DashboardPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path='/login' element={<LoginPage />} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  )
}

export default App
