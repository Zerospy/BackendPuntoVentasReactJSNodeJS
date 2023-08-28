const { Base } = require("./Base");
const { PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } = require("typeorm");
const { Product } = require("./Product");
const { Vendor } = require("./Vendor");

class Receiving extends Base {
  constructor() {
    super();
  }

  id;
  product;
  productId;
  vendor;
  vendorId;
  qty;
  price;
  payedAt;
}

Receiving.prototype.id = PrimaryGeneratedColumn();
Receiving.prototype.product = ManyToOne(type => Product);
Receiving.prototype.productId = Column();
Receiving.prototype.vendor = ManyToOne(type => Vendor);
Receiving.prototype.vendorId = Column();
//Receiving.prototype.qty = IsPositive()(Column());
//Receiving.prototype.price = IsPositive()(Column({ type: "float" }));
//Receiving.prototype.payedAt = IsNotEmpty()(Column());

module.exports = Receiving;
