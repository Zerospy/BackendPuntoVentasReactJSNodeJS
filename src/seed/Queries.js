const { openConnection } = require("../persistence");
const { Product } = require("../entity/Product");
const { getManager } = require("typeorm");

class Queries {
  static async run() {
    await openConnection();
    await Queries.fetchProduct();
  }

  static async fetchProduct() {
    const product = await getManager().findOne(Product, {
      relations: ["productType"]
    });

    console.log(product);
    console.log(product.productType);
  }
}

module.exports = { Queries };
