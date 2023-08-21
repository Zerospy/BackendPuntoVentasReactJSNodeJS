const { getConnection } = require("typeorm");
const { CrudServices } = require("./CrudServices");
const { Receiving } = require("../entity/Receiving");
const { Stock } = require("../entity/Stock");

class ReceivingServices {
  constructor() {
    this.crudServices = new CrudServices();
    this.crudServices.setEntity(Receiving);
  }

  async create(userId, receiving) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // Nueva transacción:
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.insert(Receiving, receiving);
      await queryRunner.manager.increment(
        Stock,
        { id: receiving.product.id },
        "count",
        receiving.qty
      );
      // Confirmar la transacción.
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async fetchPages(query) {
    return await this.crudServices.fetchPages(query);
  }

  async fetchById(id) {
    return await this.crudServices.fetchById(id);
  }

  async deleteById(id) {
    return await this.crudServices.deleteById(id);
  }

  async updateById(userId = "admin", where, data) {
    return await this.crudServices.updateById(userId, where, data);
  }
}

module.exports = { ReceivingServices };
