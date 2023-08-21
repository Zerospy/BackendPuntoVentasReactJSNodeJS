const { Receiving } = require("../../entity/Receiving");
const { Authorized } = require("routing-controllers");
const {
  PaginationInfo
} = require("../../decorators/PaginationInfo");
const { ReceivingServices } = require("../../services/ReceivingServices");
const { CurrentUser } = require("../../decorators/CurrentUser");

class ReceivingsController {
  constructor(receivingServices) {
    this.receivingServices = receivingServices;
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

ReceivingsController.prototype.getReceivingById = ReceivingsController.prototype.getReceivingById;
ReceivingsController.prototype.getReceivings = ReceivingsController.prototype.getReceivings;
ReceivingsController.prototype.createNewReceiving = ReceivingsController.prototype.createNewReceiving;
ReceivingsController.prototype.updateReceiving = ReceivingsController.prototype.updateReceiving;
ReceivingsController.prototype.deleteReceiving = ReceivingsController.prototype.deleteReceiving;

ReceivingsController = Authorized()(ReceivingsController);

module.exports = {
  ReceivingsController
};
