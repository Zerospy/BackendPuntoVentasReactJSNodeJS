const { Get, Controller } = require('routing-controllers');

@Controller()
class AuthController {
  @Get('/')
  async login() {
    return 'Bienvenido a la API de react-point-of-sale';
  }
}

module.exports = AuthController;
