const { Product } = require("../../entity/Product");
const { Get, Post, Body, QueryParam, Param, Put, Delete } = require("routing-controllers");
const { PaginationInfo } = require("../../decorators/PaginationInfo");
const { CrudServices } = require("../../services/CrudServices");

class ProductsController {
  constructor() {
    this.crudServices = new CrudServices();
    this.crudServices.setEntity(Product);
  }

  async getProductById(id) {
    const res = await this.crudServices.fetchById(id);
    return res || {};
  }

  async getProducts(paginationInfo, search) {
    const query = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  async createNewProduct(product, userid) {
    return await this.crudServices.create(userid, product);
  }

  async updateProduct(id, data, userid) {
    return await this.crudServices.updateById(userid, { id }, data);
  }

  async deleteProduct(id) {
    return await this.crudServices.deleteById(id);
  }
}

ProductsController.prototype.getProductById = Get("/:id", ProductsController.prototype.getProductById);
ProductsController.prototype.getProducts = Get("/", ProductsController.prototype.getProducts);
ProductsController.prototype.createNewProduct = Post("/", ProductsController.prototype.createNewProduct);
ProductsController.prototype.updateProduct = Put("/:id", ProductsController.prototype.updateProduct);
ProductsController.prototype.deleteProduct = Delete("/:id", ProductsController.prototype.deleteProduct);

module.exports = ProductsController;
