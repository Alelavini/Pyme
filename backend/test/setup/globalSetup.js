// Recrea la base de datos de test con los datos de prueba antes de correr la suite
const fs = require("fs");

module.exports = async function () {
  require("./env");
  if (fs.existsSync(process.env.DB_STORAGE)) fs.rmSync(process.env.DB_STORAGE);
  const inicializarBase = require("../../models/inicializarBase");
  await inicializarBase();
  await require("../../models/configurarSequelize").close();
};
