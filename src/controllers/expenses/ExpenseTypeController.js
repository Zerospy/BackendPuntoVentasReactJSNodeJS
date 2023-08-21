const { ExpenseType } = require("../../entity/ExpenseType");
const {
  Get,
  Post,
  Body,
  Query,
  Param
} = require("routing-controllers");

const {
  PaginationInfo
} = require("../../decorators/PaginationInfo");

const { CrudServices } = require("../../services/CrudServices");
const { CurrentUser } = require("../../decorators/CurrentUser");

class EpenseTypesController {
  constructor() {
    this.crudServices = new CrudServices();
    this.crudServices.setEntity(ExpenseType);
  }

  async getAllEpenseTypes() {
    return await this.crudServices.fetchAll();
  }

  async getExpenseTypeById(id) {
    const res = await this.crudServices.fetchById(id);
    return res || {};
  }

  async getEpenseTypes(paginationInfo, search) {
    const query = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  async createNewExpenseType(expenseType, userid) {
    return await this.crudServices.create(userid, expenseType);
  }

  async updateExpenseType(id, data, userid) {
    return await this.crudServices.updateById(userid, { id }, data);
  }

  async deleteExpenseType(id) {
    return await this.crudServices.deleteById(id);
  }
}

EpenseTypesController.prototype.getAllEpenseTypes = Get("/all/items")(EpenseTypesController.prototype.getAllEpenseTypes);
EpenseTypesController.prototype.getExpenseTypeById = Get("/:id")(EpenseTypesController.prototype.getExpenseTypeById);
EpenseTypesController.prototype.getEpenseTypes = Get()(EpenseTypesController.prototype.getEpenseTypes);
EpenseTypesController.prototype.createNewExpenseType = Post()(EpenseTypesController.prototype.createNewExpenseType);
EpenseTypesController.prototype.updateExpenseType = Put("/:id")(EpenseTypesController.prototype.updateExpenseType);
EpenseTypesController.prototype.deleteExpenseType = Delete("/:id")(EpenseTypesController.prototype.deleteExpenseType);

module.exports = EpenseTypesController;
