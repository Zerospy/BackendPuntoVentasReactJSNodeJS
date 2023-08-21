const { getManager } = require("typeorm");
const { User } = require("../entity/User");
const { UserLoginPost } = require("../dtos/authTypes").default;

class AuthServices {
  async fetchUser(userPost) {
    const entityManager = getManager();
    const user = await entityManager.findOne(User, {
      id: userPost.userid,
      password: userPost.password
    });
    return user;
  }
}

module.exports = { AuthServices };
