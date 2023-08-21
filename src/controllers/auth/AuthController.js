const jwt = require('jsonwebtoken');
const express = require('express');

//const { config } = require('./config'); // Asegúrate de tener tu archivo de configuración correctamente ubicado

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const userDetails = await fetchUserFromSomeService(req.body); // Asegúrate de tener implementada esta función

    if (!userDetails) {
      throw new Error("Credenciales de usuario inválidas.");
    }

    const claim = {
      userid: userDetails.id,
      role: userDetails.role
    };

    const authToken = jwt.sign(claim, config.jwtSecret, {
      expiresIn: config.tokenExpiry
    });
    const refreshToken = jwt.sign(claim, config.jwtSecret, {
      expiresIn: config.refreshTokenExpiry
    });

    res.json({
      authToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




/*const express = require("express");
const jwt = require("jsonwebtoken");
 // const config = require('./src/config/index.js'); // Ruta corregida
 // Ajusta la ruta según tu estructura de carpetas

const app = express();

app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const userDetails = await fetchUserFromSomeService(req.body);

    if (!userDetails) {
      throw new Error("Credenciales de usuario inválidas.");
    }

    const claim = {
      userid: userDetails.id,
      role: userDetails.role
    };

    const authToken = jwt.sign(claim, config.jwtSecret, {
      expiresIn: config.tokenExpiry
    });
    const refreshToken = jwt.sign(claim, config.jwtSecret, {
      expiresIn: config.refreshTokenExpiry
    });

    res.json({
      authToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 

app.listen(3500, () => {
  console.log("Servidor en funcionamiento en el puerto 3500");
});

// Simula obtener los detalles del usuario desde algún servicio
async function fetchUserFromSomeService(userData) {
  // Aquí deberías escribir la lógica para obtener los detalles del usuario
  // Esto es solo un ejemplo simulado
  if (userData.username === "usuario" && userData.password === "contraseña") {
    return { id: "1", role: "user" };
  }
  return null;
}
/*/