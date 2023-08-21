const { Base } = require("./Base");
const { PrimaryColumn, OneToOne, Entity, JoinColumn, Column } = require("typeorm");
const { Product } = require("./Product");

class Stock extends Base {
  constructor() {
    super();
  }

  id;
  qty;
}

Stock.prototype.id = OneToOne(type => Product);
Stock.prototype.qty = Column({ type: "float" });

module.exports = Stock;
