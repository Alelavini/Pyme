import { useState, useEffect } from 'react'
import apiFetch from '../api/client'
import styles from './Categorias.module.css'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/api/categorias')
      .then(setCategorias)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categorías</h1>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr><td colSpan={2} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Sin categorías</td></tr>
              ) : categorias.map((c) => (
                <tr key={c.IdCategoria}>
                  <td>{c.IdCategoria}</td>
                  <td>{c.Nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
