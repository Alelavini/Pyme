// Los tests usan una base de datos propia y nunca sirven el frontend compilado
const path = require("path");

process.env.NODE_ENV = "test";
process.env.DB_STORAGE = path.join(__dirname, "..", "..", ".data", "pymes.test.db");
process.env.FRONTEND_DIST = path.join(__dirname, "no-existe");
