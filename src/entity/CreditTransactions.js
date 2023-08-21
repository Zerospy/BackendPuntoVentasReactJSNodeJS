const { Base } = require("./Base");
const {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column
} = require("typeorm");
const { Customer } = require("./Customer");
const { TransactionHeader } = require("./TransactionHeader");

const CreditTransactionsType = {
  Sale: 0,
  Payment: 1,
  SaleRevertPayment: 2
};

class CreditTransactions extends Base {
  constructor() {
    super();
  }

  id;

  customer;

  customerId;

  transactionId;

  billAmount;

  amountPaid;

  balance;

  totalDebt;

  type;

  paidDate;

  isReverted;
}

CreditTransactions.prototype.id = PrimaryGeneratedColumn();
CreditTransactions.prototype.customer = ManyToOne(Customer, { onDelete: "RESTRICT", onUpdate: "CASCADE" });
CreditTransactions.prototype.customerId = Column();
CreditTransactions.prototype.transactionId = ManyToOne(TransactionHeader, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  nullable: true
});
CreditTransactions.prototype.billAmount = Column({ type: "float", nullable: true });
CreditTransactions.prototype.amountPaid = Column({ type: "float" });
CreditTransactions.prototype.balance = Column({ type: "float" });
CreditTransactions.prototype.totalDebt = Column({ type: "float" });
CreditTransactions.prototype.type = Column();
CreditTransactions.prototype.paidDate = Column();
CreditTransactions.prototype.isReverted = Column();

module.exports = CreditTransactions;
  