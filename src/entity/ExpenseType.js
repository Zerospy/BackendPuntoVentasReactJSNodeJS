const { EntitySchema } = require("typeorm");
const { Base } = require("./Base");

class ExpenseType extends Base {
  constructor() {
    super();
  }
}

module.exports = new EntitySchema({
  name: "ExpenseType",
  target: ExpenseType,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    description: {
      type: "varchar",
      nullable: false,
    },
  },
});
