const { User, Role } = require("../../entity/User");
const { PaginationInfo } = require("../../decorators/PaginationInfo");
const { CrudServices } = require("../../services/CrudServices");
const { CurrentUser } = require("../../decorators/CurrentUser");
const { Authorized } = require("routing-controllers");

class UsersController {
  constructor() {  
    this.crudServices = new CrudServices();
    this.crudServices.setEntity(User);
  }

  async getUserById(id) {
    const res = await this.crudServices.fetchById(id);
    return res || {};
  }

  async getUsers(paginationInfo, search) {
    const query = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  async createNewUser(user, userid) {
    return await this.crudServices.create(userid, user);
  }

  async updateUser(id, data, userid) {
    return await this.crudServices.updateById(userid, { id }, data);
  }

  async deleteUser(id) {
    return await this.crudServices.deleteById(id);
  }
}

const authorizedUsersController = new UsersController();
authorizedUsersController.crudServices = new CrudServices();
authorizedUsersController.crudServices.setEntity(User);
authorizedUsersController.crudServices = Authorized(Role.Admin)(authorizedUsersController.crudServices);

module.exports = {
  UsersController: authorizedUsersController
};
