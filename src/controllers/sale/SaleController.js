const { Receiving } = require("../../entity/Receiving");
const { ReceivingServices } = require("../../services/ReceivingServices");

class ReceivingsController {
  constructor() {
    this.receivingServices = new ReceivingServices();
  }

  async getReceivingById(id) {
    const res = await this.receivingServices.fetchById(id);
    return res || {};
  }

  async getReceivings(paginationInfo, search) {
    const query = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.receivingServices.fetchPages(query);
  }

  async createNewReceiving(Receiving, userid) {
    return await this.receivingServices.create(userid, Receiving);
  }

  async updateReceiving(id, data, userid) {
    return await this.receivingServices.updateById(userid, { id }, data);
  }

  async deleteReceiving(id) {
    return await this.receivingServices.deleteById(id);
  }
}

module.exports = {
  ReceivingsController
};
