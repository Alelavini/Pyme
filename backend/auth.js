const jwt = require("jsonwebtoken");
const { accessTokenSecret, refreshTokenSecret } = require("./config");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        // 401 para que el cliente intente renovar el access token con el refresh token
        return res.status(401).json({ message: "token no es valido" });
      }

      res.locals.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Acceso denegado" });
  }
};

const authorizedRoles = (rolesPermitidos) => {
  return (req, res, next) => {
    const user = res.locals.user;

    if (user && rolesPermitidos.includes(user.rol)) {
      next();
    } else {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }
  };
};


module.exports = {
  authenticateJWT,
  authorizedRoles,
  accessTokenSecret,
  refreshTokenSecret
};
