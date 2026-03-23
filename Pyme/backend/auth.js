const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        //return res.sendStatus(400);
        return res.status(403).json({ message: "token no es valido" });
      }
      
      res.locals.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Acceso denegado" });
  }
};

// auth.js (o donde tengas authenticateJWT)

const authorizedRoles = (rolesPermitidos) => {
  return (req, res, next) => {
    const user = res.locals.user;
    
    if (user && rolesPermitidos.includes(user.rol)) {
      next();
    } else {
      // MODIFICACIÓN PARA EL TEST: Mensaje exacto en minúsculas y con "!"
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


