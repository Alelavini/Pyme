const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const usuarios = require('../models/usuariosModel');
const auth = require('../auth');

const ROLES_VALIDOS = ['jefe', 'empleado'];

// Obtener todos los usuarios (solo jefe)
router.get('/api/usuarios',
  auth.authenticateJWT,
  auth.authorizedRoles(['jefe']),
  async function (req, res) {
    try {
      const items = await usuarios.findAll({
        attributes: [
          'IdUsuario',
          ['Nombre', 'Usuario'],
          ['Clave', 'Clave'],
          'Rol'
        ]
      });
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  }
);

// Crear un nuevo usuario (solo jefe)
router.post('/api/usuarios',
  auth.authenticateJWT,
  auth.authorizedRoles(['jefe']),
  async function (req, res) {
    try {
      const { nombre, clave, rol } = req.body;

      if (!nombre || !clave || !rol) {
        return res.status(400).json({ message: 'nombre, clave y rol son requeridos' });
      }

      if (!ROLES_VALIDOS.includes(rol)) {
        return res.status(400).json({ message: 'Rol inválido. Debe ser "jefe" o "empleado"' });
      }

      if (nombre.trim().length < 3) {
        return res.status(400).json({ message: 'El nombre debe tener al menos 3 caracteres' });
      }

      if (clave.length < 4) {
        return res.status(400).json({ message: 'La clave debe tener al menos 4 caracteres' });
      }

      const existente = await usuarios.findOne({ where: { Nombre: nombre.trim() } });
      if (existente) {
        return res.status(409).json({ message: 'Ya existe un usuario con ese nombre' });
      }

      const claveHash = await bcrypt.hash(clave, 10);

      const nuevo = await usuarios.create({
        Nombre: nombre.trim(),
        Clave: claveHash,
        Rol: rol
      });

      res.status(201).json({
        IdUsuario: nuevo.IdUsuario,
        Usuario: nuevo.Nombre,
        Rol: nuevo.Rol
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el usuario' });
    }
  }
);

module.exports = router;
