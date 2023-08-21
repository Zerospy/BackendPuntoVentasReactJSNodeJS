const { ProductType } = require('../../entity/ProductType');
const {
  Get,
  Post,
  Body,
  Authorized,
  QueryParam,
  Param,
  Put,
  Delete
} = require('routing-controllers');
const { CrudServices } = require('../../services/CrudServices');
const { CurrentUser } = require('../../decorators/CurrentUser');

const {
  PaginationInfo
} = require('../../decorators/PaginationInfo');

class ProductTypesController {
  constructor() {
    this.crudServices = new CrudServices();
    this.crudServices.setEntity(ProductType);
  }

  async getAllProductTypes() {
    return await this.crudServices.fetchAll();
  }

  async getProductTypeById(id) {
    const res = await this.crudServices.fetchById(id);
    return res || {};
  }

  async getProductTypes(paginationInfo, search) {
    const query = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  async createNewProductType(productType, userid) {
    return await this.crudServices.create(userid, productType);
  }

  async updateProductType(id, data, userid) {
    return await this.crudServices.updateById(userid, { id }, data);
  }

  async deleteProductType(id) {
    return await this.crudServices.deleteById(id);
  }
}

ProductTypesController.prototype.getAllProductTypes = Get('/all/items')(ProductTypesController.prototype.getAllProductTypes);
ProductTypesController.prototype.getProductTypeById = Get('/:id')(ProductTypesController.prototype.getProductTypeById);
ProductTypesController.prototype.getProductTypes = Get()(ProductTypesController.prototype.getProductTypes);
ProductTypesController.prototype.createNewProductType = Post()(ProductTypesController.prototype.createNewProductType);
ProductTypesController.prototype.updateProductType = Put('/:id')(ProductTypesController.prototype.updateProductType);
ProductTypesController.prototype.deleteProductType = Delete('/:id')(ProductTypesController.prototype.deleteProductType);

module.exports = {
  ProductTypesController
};
