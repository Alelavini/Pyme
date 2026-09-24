const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const { dbStorage } = require('../config');

// SQLite no crea la carpeta contenedora por sí mismo
fs.mkdirSync(path.dirname(dbStorage), { recursive: true });

// Configuración de la base de datos SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbStorage,
  logging: false,
  define: {
    freezeTableName: true,  // no pluraliza los nombres de las tablas, modelo = tabla
    timestamps: false,  // no crea campos de fecha de creación y modificación
  },
});

module.exports = sequelize;
