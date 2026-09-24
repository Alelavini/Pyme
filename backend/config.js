require("dotenv").config({ quiet: true });
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

// En desarrollo se usan secretos por defecto para que el proyecto funcione sin configuración.
// En producción son obligatorios.
function secret(name, devDefault) {
  const value = process.env[name];
  if (value) return value;
  if (isProduction) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return devDefault;
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "desarrollo",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  dbStorage: process.env.DB_STORAGE || path.join(__dirname, ".data", "pymes.db"),
  frontendDist: process.env.FRONTEND_DIST || path.join(__dirname, "..", "frontend", "dist"),
  accessTokenSecret: secret("ACCESS_TOKEN_SECRET", "dev-access-secret-cambiar-en-produccion"),
  refreshTokenSecret: secret("REFRESH_TOKEN_SECRET", "dev-refresh-secret-cambiar-en-produccion"),
};
