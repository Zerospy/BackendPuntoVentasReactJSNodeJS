const { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } = require("typeorm");
const { Base } = require("./Base");
const { ProductType } = require("./ProductType");
const { IsNotEmpty, IsPositive } = require("class-validator");

class Product extends Base {
  constructor() {
    super();
  }

  id;
  name;
  description;
  costPrice;
  sellingPrice;
  productType;
  productTypeId;
}

Product.prototype.id = PrimaryColumn();
Product.prototype.name = Column();
Product.prototype.description = Column();
Product.prototype.costPrice = Column({ type: "float" });
Product.prototype.sellingPrice = Column({ type: "float" });
Product.prototype.productType = ManyToOne(ProductType, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  cascade: ["insert"]
});
Product.prototype.productTypeId = Column();

module.exports = Product;
