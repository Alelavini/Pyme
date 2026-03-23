const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const usuarios = require('../models/usuariosModel');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

let refreshTokens = [];

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Demasiados intentos, esperá 15 minutos' }
});

router.post("/api/login", loginLimiter, async (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'Login de usuarios'

  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(401).json({ message: "Usuario o clave incorrectos" });
  }

  let user;
  try {
    user = await usuarios.findOne({ where: { Nombre: usuario } });
  } catch {
    return res.status(500).json({ message: "Error interno" });
  }

  if (!user) {
    return res.status(401).json({ message: "Usuario o clave incorrectos" });
  }

  // Soporta tanto hashes bcrypt como texto plano (para migración gradual)
  let claveValida;
  if (user.Clave.startsWith('$2b$') || user.Clave.startsWith('$2a$')) {
    claveValida = await bcrypt.compare(clave, user.Clave);
  } else {
    claveValida = clave === user.Clave;
  }

  if (!claveValida) {
    return res.status(401).json({ message: "Usuario o clave incorrectos" });
  }

  const accessToken = jwt.sign(
    { usuario: user.Nombre, rol: user.Rol },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "20m" }
  );

  const refreshToken = jwt.sign(
    { usuario: user.Nombre, rol: user.Rol },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  refreshTokens.push(refreshToken);

  res.json({
    accessToken,
    refreshToken,
    message: "Bienvenido " + user.Nombre + " (rol: " + user.Rol + ")",
  });
});

router.post("/api/logout", (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'Logout: invalida el refresh token'

  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader) {
    token = authHeader.split(" ")[1];
  }

  const mensaje = refreshTokens.includes(token)
    ? "Usuario deslogueado correctamente!"
    : "Logout inválido!";

  refreshTokens = refreshTokens.filter((t) => t !== token);

  res.json({ message: mensaje });
});

router.post("/api/refreshtoken", (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'refresh token'
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { usuario: user.usuario, rol: user.rol },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "20m" }
    );

    res.json({ accessToken });
  });
});

module.exports = router;
