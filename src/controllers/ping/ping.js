const express = require('express');

class AuthController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', async (req, res) => {
      res.send('Bienvenido a la API de react-point-of-sale');
    });
  }
  
  getRouter() {
    return this.router;
  }
}

module.exports = AuthController;
