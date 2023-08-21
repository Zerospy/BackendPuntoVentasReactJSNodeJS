
const { Role } = require("../entity/User");

class UserLoginPost {
  constructor(userid, password) {
    this.userid = userid;
    this.password = password;
  }
}

class Claim {
  constructor(userid, role) {
    this.userid = userid;
    this.role = role;
  }
}

// DTO para la respuesta de inicio de sesión
class LoginResponse {
  constructor(authToken, refreshToken) {
    this.authToken = authToken;
    this.refreshToken = refreshToken;
  }
}

module.exports = {
  UserLoginPost,
  Claim
};
