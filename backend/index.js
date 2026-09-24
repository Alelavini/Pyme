const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config"); // carga las variables del archivo .env antes que todo
const inicializarBase = require("./models/inicializarBase");

// 1. Crear servidor
const app = express();
app.locals.fechaInicio = new Date();

const indexHtml = path.join(config.frontendDist, "index.html");
const servirFrontend = fs.existsSync(indexHtml);

// 2. Middlewares (deben ir antes de las rutas)
app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// 3. Ruta raíz y health check
app.get("/", (req, res, next) => {
  if (servirFrontend) return next(); // en producción la raíz la atiende el frontend
  res.send("Backend inicial dds-backend!");
});

app.get("/_isalive", (req, res) => {
  res.status(200).send("Ejecutandose desde: " + config.nodeEnv);
});

// 4. Rutas de la API
app.use(require("./routes/categoriasmock"));
app.use(require("./routes/categorias"));
app.use(require("./routes/articulos"));
app.use(require("./routes/seguridad"));
app.use(require("./routes/usuarios"));

// 5. Frontend compilado (si existe): el backend sirve la SPA en el mismo puerto
if (servirFrontend) {
  app.use(express.static(config.frontendDist));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api") && req.accepts("html")) {
      return res.sendFile(indexHtml);
    }
    next();
  });
}

// Este middleware captura cualquier ruta que no exista
app.use((req, res) => {
  res.status(404).send("No encontrada!");
});

if (require.main === module) {   // si es el módulo principal -> levantamos el servidor
  inicializarBase().then(() => {
    app.listen(config.port, () => {
      console.log(`sitio escuchando en http://localhost:${config.port}`);
    });
  });
}

module.exports = app; // para testing
