const { CrudServices } = require('../../services/CrudServices');
const { Customer } = require('../../entity/Customer');

class CustomerController {
  constructor() {
    this.crudServices = new CrudServices();
    this.crudServices.setEntity(Customer);
  }

  async getCustomerById(id) {
    return await this.crudServices.fetchById(id);
  }

  async getCustomers(paginationInfo, search) {
    const query = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  async createNewCustomer(customer, userid) {
    return await this.crudServices.create(userid, customer);
  }

  async updateCustomer(id, data, userid) {
    const filter = { id };
    return await this.crudServices.updateById(userid, filter, data);
  }

  async deleteCustomer(id) {
    return await this.crudServices.deleteById(id);
  }
}

module.exports = CustomerController;
