const { Base } = require("./Base");
const {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
  RelationId
} = require("typeorm");
const { Customer } = require("./Customer");

const { TransactionDetails } = require("./TransactionDetails");

const SalesType = {
  CreditSale: 0,
  CounterSale: 1
};

const TransactionStatus = {
  Init: 0,
  Pending: 1,
  Done: 2
};

class TransactionHeader extends Base {
  constructor() {
    super();
  }

  id;
  transactionDetails;
  discountOnItems;
  discountOnTotal;
  tax;
  taxPercentageString;
  billAmount;
  netAmount;
  amountPaid;
  salesType;
  transactionStatus;
  comments;
  customer;
  customerId;
  isActive;
}

TransactionHeader.prototype.id = PrimaryColumn();
TransactionHeader.prototype.transactionDetails = OneToMany(
  type => TransactionDetails,
  datasource => datasource.transactionHeader
);
TransactionHeader.prototype.discountOnItems = Column({ type: "float" });
TransactionHeader.prototype.discountOnTotal = Column({ type: "float" });
TransactionHeader.prototype.tax = Column({ type: "float" });
TransactionHeader.prototype.taxPercentageString = Column();
TransactionHeader.prototype.billAmount = Column({ type: "float", default: 0 });
TransactionHeader.prototype.netAmount = Column({ type: "float" });
TransactionHeader.prototype.amountPaid = Column({ type: "float" });
TransactionHeader.prototype.salesType = Column();
TransactionHeader.prototype.transactionStatus = Column();
TransactionHeader.prototype.comments = Column();
TransactionHeader.prototype.customer = ManyToOne(type => Customer, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  nullable: true
});
TransactionHeader.prototype.customerId = Column();
TransactionHeader.prototype.isActive = Column();

module.exports = TransactionHeader;
