const { Base } = require("./Base");
const { PrimaryColumn, ManyToOne, JoinColumn, Column, Entity } = require("typeorm");
const { Product } = require("./Product");
const { TransactionHeader } = require("./TransactionHeader");

class TransactionDetails extends Base {
  constructor() {
    super();
  }

  id;
  transactionHeader;
  product;
  productId;
  qty;
  costPrice;
  sellingPrice;
  discount;
  price;
}

TransactionDetails.prototype.id = PrimaryColumn();
TransactionDetails.prototype.transactionHeader = ManyToOne(
  type => TransactionHeader,
  datasource => datasource.transactionDetails,
  { onUpdate: "CASCADE", onDelete: "CASCADE" }
);
TransactionDetails.prototype.product = ManyToOne(type => Product);
TransactionDetails.prototype.productId = Column();
TransactionDetails.prototype.qty = Column();
TransactionDetails.prototype.costPrice = Column({ type: "float" });
TransactionDetails.prototype.sellingPrice = Column({ type: "float" });
TransactionDetails.prototype.discount = Column({ type: "float" });
TransactionDetails.prototype.price = Column({ type: "float" });

module.exports = TransactionDetails;
