import { useState, useEffect, useCallback } from 'react'
import apiFetch from '../api/client'
import Modal from '../components/Modal'
import ArticuloForm from './ArticuloForm'
import styles from './Articulos.module.css'

export default function Articulos() {
  const [articulos, setArticulos] = useState([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [filtros, setFiltros] = useState({ Nombre: '', Activo: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | { mode: 'create' | 'edit', articulo?: obj }

  const PAGE_SIZE = 10

  const fetchArticulos = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ Pagina: pagina })
      if (filtros.Nombre) params.set('Nombre', filtros.Nombre)
      if (filtros.Activo !== '') params.set('Activo', filtros.Activo)
      const data = await apiFetch(`/api/articulos?${params}`)
      setArticulos(data.Items || [])
      setTotal(data.RegistrosTotal || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [pagina, filtros])

  useEffect(() => { fetchArticulos() }, [fetchArticulos])

  async function handleToggle(id) {
    try {
      await apiFetch(`/api/articulos/${id}`, { method: 'DELETE' })
      fetchArticulos()
    } catch (err) {
      alert(err.message)
    }
  }

  function handleFiltroChange(e) {
    setFiltros((f) => ({ ...f, [e.target.name]: e.target.value }))
    setPagina(1)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Artículos</h1>
        <button className="btn-primary" onClick={() => setModal({ mode: 'create' })}>
          + Nuevo artículo
        </button>
      </div>

      <div className={styles.filters}>
        <input
          name="Nombre"
          placeholder="Buscar por nombre..."
          value={filtros.Nombre}
          onChange={handleFiltroChange}
          className={styles.searchInput}
        />
        <select name="Activo" value={filtros.Activo} onChange={handleFiltroChange} className={styles.selectFilter}>
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
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
                <th>Precio</th>
                <th>Cód. Barra</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articulos.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Sin resultados</td></tr>
              ) : articulos.map((a) => (
                <tr key={a.IdArticulo}>
                  <td>{a.IdArticulo}</td>
                  <td>{a.Nombre}</td>
                  <td>${Number(a.Precio).toFixed(2)}</td>
                  <td className={styles.mono}>{a.CodigoDeBarra}</td>
                  <td>{a.IdCategoria}</td>
                  <td>{a.Stock}</td>
                  <td>
                    <span className={`badge ${a.Activo ? 'badge-active' : 'badge-inactive'}`}>
                      {a.Activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className="btn-icon" title="Editar" onClick={() => setModal({ mode: 'edit', articulo: a })}>✏️</button>
                    <button
                      className="btn-icon"
                      title={a.Activo ? 'Desactivar' : 'Activar'}
                      onClick={() => handleToggle(a.IdArticulo)}
                    >
                      {a.Activo ? '🔴' : '🟢'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.pagination}>
        <span className={styles.count}>
          {total} artículo{total !== 1 ? 's' : ''}
        </span>
        <div className={styles.pageButtons}>
          <button
            className="btn-secondary"
            onClick={() => setPagina((p) => p - 1)}
            disabled={pagina <= 1}
          >
            ← Anterior
          </button>
          <span className={styles.pageInfo}>Página {pagina} / {totalPages || 1}</span>
          <button
            className="btn-secondary"
            onClick={() => setPagina((p) => p + 1)}
            disabled={pagina >= totalPages}
          >
            Siguiente →
          </button>
        </div>
      </div>

      {modal && (
        <Modal
          title={modal.mode === 'create' ? 'Nuevo artículo' : 'Editar artículo'}
          onClose={() => setModal(null)}
        >
          <ArticuloForm
            articulo={modal.articulo}
            onSuccess={() => { setModal(null); fetchArticulos() }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
