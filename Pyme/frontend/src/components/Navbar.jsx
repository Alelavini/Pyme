import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>Pymes</div>
      <div className={styles.links}>
        <NavLink to="/articulos"  className={({ isActive }) => isActive ? styles.active : ''}>Artículos</NavLink>
        <NavLink to="/categorias" className={({ isActive }) => isActive ? styles.active : ''}>Categorías</NavLink>
        <NavLink to="/usuarios"   className={({ isActive }) => isActive ? styles.active : ''}>Usuarios</NavLink>
      </div>
      <div className={styles.right}>
        <span className={styles.username}>{user?.usuario}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>Salir</button>
      </div>
    </nav>
  )
}
