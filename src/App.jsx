import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Coupons from './pages/Coupons'
import CouponForm from './pages/CouponForm'
import Websites from './pages/Websites'
import Users from './pages/Users'
import UserCouponStatistics from './pages/UserCouponStatistics'
import APIDocumentation from './pages/APIDocumentation'
import Layout from './components/Layout'

function ProtectedRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="coupons/new" element={<CouponForm />} />
        <Route path="coupons/edit/:id" element={<CouponForm />} />
        <Route path="websites" element={<Websites />} />
        <Route path="users" element={<Users />} />
        <Route path="statistics" element={<UserCouponStatistics />} />
        <Route path="api-documentation" element={<APIDocumentation />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
