const { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } = require("typeorm");
const { Base } = require("./Base");
const { ExpenseType } = require("./ExpenseType");

class Expense extends Base {
  constructor() {
    super();
  }

  id;
  description;
  amount;
  spentAt;
  expenseType;
  expenseTypeId;
}

Expense.prototype.id = PrimaryGeneratedColumn();
Expense.prototype.description = Column();
Expense.prototype.amount = Column({ type: "float" });
Expense.prototype.spentAt = Column();
Expense.prototype.expenseType = ManyToOne(ExpenseType, { onDelete: "RESTRICT", onUpdate: "CASCADE" });
Expense.prototype.expenseTypeId = Column();

module.exports = Expense;
