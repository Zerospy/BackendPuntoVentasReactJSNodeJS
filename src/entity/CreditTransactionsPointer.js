const { Base } = require("./Base");
const { Entity } = require("typeorm");
const { Customer } = require("./Customer");

class CreditTransactionsPointer extends Base {
  constructor() {
    super();
  }

  customer;
  customerId;
  seqPointer;
  balanceAmount;
}

CreditTransactionsPointer.prototype.customer = OneToOne(Customer, { onDelete: "RESTRICT", onUpdate: "CASCADE" });
CreditTransactionsPointer.prototype.customerId = PrimaryColumn();
CreditTransactionsPointer.prototype.seqPointer = Column();
CreditTransactionsPointer.prototype.balanceAmount = Column();

module.exports = CreditTransactionsPointer;
