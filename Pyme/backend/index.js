require('dotenv').config(); // Carga las variables del archivo .env ANTES que todo
const express = require("express");

// 1. Crear servidor
const app = express();
const inicializarBase = require("./models/inicializarBase");  // inicializar base de datos

// 2. MIDDLEWARES (Configuraciones obligatorias)
// Esto DEBE ir antes de las rutas
app.use(express.json()); 

// 3. Controlar ruta raíz
app.get("/", (req, res) => {
  res.send("Backend inicial dds-backend!");
});

// 4. Cargar Rutas
const categoriasmockRouter = require("./routes/categoriasmock");
app.use(categoriasmockRouter);

// 5. Levantar servidor
const port = 3000;
app.locals.fechaInicio = new Date();

const categoriasRouter = require("./routes/categorias");
app.use(categoriasRouter)

const articulosRouter = require("./routes/articulos");
app.use(articulosRouter);

const cors = require("cors");

app.use(
  cors({
    // Usará la URL que definas en el archivo .env o en Azure
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

const seguridadRouter = require("./routes/seguridad");
app.use(seguridadRouter);
const usuariosRouter = require("./routes/usuarios");
app.use(usuariosRouter);

app.get("/_isalive", (req, res) => {
  res.status(200).send("Ejecutandose desde: " + process.env.NODE_ENV || "desarrollo");
});

// Este middleware captura cualquier ruta que no exista
app.use((req, res) => {
  res.status(404).send("No encontrada!");
});

if (require.main === module) {   // si no es llamado por otro módulo, es decir, si es el módulo principal -> levantamos el servidor
  inicializarBase().then(() => {
   app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
    });
  });
}
module.exports = app; // para testing



