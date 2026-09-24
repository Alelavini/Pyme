import { useState, useEffect } from 'react'
import apiFetch from '../api/client'
import styles from './ArticuloForm.module.css'

const EMPTY = {
  Nombre: '',
  Precio: '',
  CodigoDeBarra: '',
  IdCategoria: '',
  Stock: '',
  FechaAlta: new Date().toISOString().split('T')[0],
  Activo: true,
}

export default function ArticuloForm({ articulo, onSuccess, onCancel }) {
  const isEdit = !!articulo
  const [form, setForm] = useState(EMPTY)
  const [categorias, setCategorias] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (articulo) {
      setForm({
        Nombre: articulo.Nombre || '',
        Precio: articulo.Precio || '',
        CodigoDeBarra: articulo.CodigoDeBarra || '',
        IdCategoria: articulo.IdCategoria || '',
        Stock: articulo.Stock || '',
        FechaAlta: articulo.FechaAlta || '',
        Activo: articulo.Activo ?? true,
      })
    }
    apiFetch('/api/categorias').then(setCategorias).catch(() => {})
  }, [articulo])

  function validate() {
    const e = {}
    if (!form.Nombre || form.Nombre.length < 5) e.Nombre = 'Mínimo 5 caracteres'
    if (!form.Precio || isNaN(form.Precio)) e.Precio = 'Precio inválido'
    if (!/^\d{13}$/.test(form.CodigoDeBarra)) e.CodigoDeBarra = 'Debe tener exactamente 13 dígitos'
    if (!form.IdCategoria) e.IdCategoria = 'Requerido'
    if (form.Stock === '' || isNaN(form.Stock)) e.Stock = 'Stock inválido'
    if (!form.FechaAlta) e.FechaAlta = 'Requerido'
    return e
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      const body = {
        ...form,
        Precio: parseFloat(form.Precio),
        Stock: parseInt(form.Stock),
        IdCategoria: parseInt(form.IdCategoria),
      }
      if (isEdit) {
        await apiFetch(`/api/articulos/${articulo.IdArticulo}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        await apiFetch('/api/articulos/', { method: 'POST', body: JSON.stringify(body) })
      }
      onSuccess()
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Nombre</label>
          <input name="Nombre" value={form.Nombre} onChange={handleChange} placeholder="Mínimo 5 caracteres" />
          {errors.Nombre && <p className="error-msg">{errors.Nombre}</p>}
        </div>
        <div className={styles.field}>
          <label>Precio ($)</label>
          <input name="Precio" type="number" step="0.01" min="0" value={form.Precio} onChange={handleChange} />
          {errors.Precio && <p className="error-msg">{errors.Precio}</p>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Código de Barra (13 dígitos)</label>
          <input name="CodigoDeBarra" value={form.CodigoDeBarra} onChange={handleChange} maxLength={13} placeholder="0000000000000" />
          {errors.CodigoDeBarra && <p className="error-msg">{errors.CodigoDeBarra}</p>}
        </div>
        <div className={styles.field}>
          <label>Categoría</label>
          <select name="IdCategoria" value={form.IdCategoria} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            {categorias.map((c) => (
              <option key={c.IdCategoria} value={c.IdCategoria}>{c.Nombre}</option>
            ))}
          </select>
          {errors.IdCategoria && <p className="error-msg">{errors.IdCategoria}</p>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Stock</label>
          <input name="Stock" type="number" min="0" value={form.Stock} onChange={handleChange} />
          {errors.Stock && <p className="error-msg">{errors.Stock}</p>}
        </div>
        <div className={styles.field}>
          <label>Fecha de Alta</label>
          <input name="FechaAlta" type="date" value={form.FechaAlta} onChange={handleChange} />
          {errors.FechaAlta && <p className="error-msg">{errors.FechaAlta}</p>}
        </div>
      </div>

      <label className={styles.checkboxLabel}>
        <input name="Activo" type="checkbox" checked={form.Activo} onChange={handleChange} />
        Activo
      </label>

      {serverError && <p className="error-msg">{serverError}</p>}

      <div className={styles.footer}>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear artículo'}
        </button>
      </div>
    </form>
  )
}
