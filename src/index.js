const jwt = require('jsonwebtoken');
const express = require('express');
const { createExpressServer, useContainer } = require('routing-controllers');

const { openConnection } = require('./persistence');

const app = express();

// Función para comprobar la autorización
async function authorizationChecker(action, roles) {
  return new Promise((resolve) => {
    const token = (action.request.headers['authorization'] || '').replace(
      'Bearer ',
      ''
    );

    if (!token) {
      throw new Error('Token inválido');
    }

    // Definir config.jwtSecret aquí o importarlo si es necesario
    const jwtSecret = 'tu_clave_secreta_jwt';

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        throw new Error('Token expirado o inválido.');
      }
      action.request.token = decoded;
      if (roles.length > 0) {
        const hasRights = roles.filter((r) => r === decoded.role).length > 0;
        if (hasRights === true) {
          resolve(true);
        } else {
          throw new Error(
            'No tienes permisos para realizar esta operación'
          );
        }
      } else {
        resolve(true);
      }
    });
  });
}

// Función para crear el servidor
(async () => {
  try {
    await openConnection();

    // Configura aquí tus middlewares personalizados si los tienes

    // Configuración de contenedor y controladores
    const server = createExpressServer({
      authorizationChecker: authorizationChecker,
      cors: true,
      routePrefix: '/api',
      defaultErrorHandler: false,
      middlewares: [__dirname + '/middlewares/**/*.js'], // Cambia la extensión a .js
      controllers: [__dirname + '/controllers/**/*.js'], // Cambia la extensión a .js
    });

    if (server.expressMiddlewares && Array.isArray(server.expressMiddlewares)) {
      server.expressMiddlewares.forEach((middleware) => {
        app.use(middleware);
      });
    }

    const port = process.env.PORT || 3500;
    app.listen(port, () => {
      console.log(`Servidor iniciado en el puerto ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
    