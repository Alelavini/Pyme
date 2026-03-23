import { useState, useEffect } from 'react'
import apiFetch from '../api/client'
import styles from './Usuarios.module.css'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ nombre: '', clave: '', rol: 'empleado' })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function cargarUsuarios() {
    setLoading(true)
    apiFetch('/api/usuarios')
      .then(setUsuarios)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setSubmitting(true)
    try {
      await apiFetch('/api/usuarios', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setFormSuccess('Usuario creado correctamente.')
      setForm({ nombre: '', clave: '', rol: 'empleado' })
      cargarUsuarios()
    } catch (err) {
      setFormError(err.message || 'Error al crear el usuario')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Usuarios</h1>
        <p className={styles.subtitle}>Solo visible para rol <strong>jefe</strong></p>
      </div>

      {error && (
        <div className={styles.errorBox}>
          {error === 'Error 403' || error.includes('403')
            ? 'No tenés permisos para ver esta sección.'
            : error}
        </div>
      )}

      {!error && (
        <>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Nuevo usuario</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <label className={styles.label}>Nombre</label>
                <input
                  className={styles.input}
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="nombre de usuario"
                  required
                  minLength={3}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label}>Clave</label>
                <input
                  className={styles.input}
                  type="password"
                  value={form.clave}
                  onChange={(e) => setForm({ ...form, clave: e.target.value })}
                  placeholder="mínimo 4 caracteres"
                  required
                  minLength={4}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label}>Rol</label>
                <select
                  className={styles.input}
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                >
                  <option value="empleado">empleado</option>
                  <option value="jefe">jefe</option>
                </select>
              </div>
              {formError && <div className={styles.errorBox}>{formError}</div>}
              {formSuccess && <div className={styles.successBox}>{formSuccess}</div>}
              <button className={styles.submitBtn} type="submit" disabled={submitting}>
                {submitting ? 'Creando...' : 'Crear usuario'}
              </button>
            </form>
          </div>

          <div className={styles.tableWrapper}>
            {loading ? (
              <div className="loading">Cargando...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Sin usuarios</td></tr>
                  ) : usuarios.map((u) => (
                    <tr key={u.IdUsuario}>
                      <td>{u.IdUsuario}</td>
                      <td>{u.Usuario}</td>
                      <td>
                        <span className={`badge ${u.Rol === 'jefe' ? 'badge-active' : 'badge-inactive'}`}>
                          {u.Rol}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
