const { Entity, Column, PrimaryColumn } = require('typeorm');
const { Base } = require('./Base');

class ProductType extends Base {
  constructor() {
    super();
  }

  id;
  description;
}

ProductType.prototype.id = PrimaryColumn();
ProductType.prototype.description = Column();

module.exports = ProductType;
