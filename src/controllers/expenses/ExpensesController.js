const { Expense } = require("../../entity/Expense");
const {
  Get,
  Post,
  Body,
  Query,
  Param, Put, Delete
} = require("routing-controllers");

const {
  PaginationInfo
} = require("../../decorators/PaginationInfo");

const { CrudServices } = require("../../services/CrudServices");
const { CurrentUser } = require("../../decorators/CurrentUser");

class ExpensesController {
  constructor() {
    this.crudServices = new CrudServices();
    this.crudServices.setEntity(Expense);
  }

  async getExpenseById(id) {
    const res = await this.crudServices.fetchById(id);
    return res || {};
  }

  async getExpenses(paginationInfo, search) {
    const query = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  async createNewExpense(expense, userid) {
    return await this.crudServices.create(userid, expense);
  }

  async updateExpense(id, data, userid) {
    return await this.crudServices.updateById(userid, { id }, data);
  }

  async deleteExpense(id) {
    return await this.crudServices.deleteById(id);
  }
}

ExpensesController.prototype.getExpenseById = Get("/:id")(ExpensesController.prototype.getExpenseById);
ExpensesController.prototype.getExpenses = Get()(ExpensesController.prototype.getExpenses);
ExpensesController.prototype.createNewExpense = Post()(ExpensesController.prototype.createNewExpense);
ExpensesController.prototype.updateExpense = Put("/:id")(ExpensesController.prototype.updateExpense);
ExpensesController.prototype.deleteExpense = Delete("/:id")(ExpensesController.prototype.deleteExpense);

module.exports = ExpensesController;
