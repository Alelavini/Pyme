import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Articulos from './pages/Articulos'
import Categorias from './pages/Categorias'
import Usuarios from './pages/Usuarios'

export default function App() {
  const { user } = useAuth()

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/articulos" replace /> : <Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/articulos"  element={<Articulos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/usuarios"   element={<Usuarios />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? '/articulos' : '/login'} replace />} />
      </Routes>
    </>
  )
}
