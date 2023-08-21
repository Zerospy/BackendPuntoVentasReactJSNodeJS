const { Base } = require("./Base");
const { PrimaryColumn, Column } = require("typeorm");

class TransactionId extends Base {
  constructor() {
    super();
  }

  id;
  count;
}

TransactionId.prototype.id = PrimaryColumn();
TransactionId.prototype.count = Column();

module.exports = TransactionId;
