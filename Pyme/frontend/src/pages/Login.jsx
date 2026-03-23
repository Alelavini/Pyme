import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ usuario: '', clave: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.usuario, form.clave)
      navigate('/articulos')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>Pymes</div>
        <p className={styles.subtitle}>Sistema de gestión de inventario</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={form.usuario}
              onChange={(e) => setForm({ ...form, usuario: e.target.value })}
              placeholder="Ingresá tu usuario"
              autoFocus
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="clave">Contraseña</label>
            <input
              id="clave"
              type="password"
              value={form.clave}
              onChange={(e) => setForm({ ...form, clave: e.target.value })}
              placeholder="Ingresá tu contraseña"
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
