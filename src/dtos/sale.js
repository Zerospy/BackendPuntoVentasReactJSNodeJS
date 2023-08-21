const { IsNumber, Min, IsNotEmpty } = require("class-validator");
const { SalesType } = require("../entity/TransactionHeader");

class CheckoutSale {
  constructor() {
    this.transactionId = 0;
    this.totalDiscount = 0;
    this.tax = 0;
    this.taxPercentageString = "";
    this.customerId = undefined;
    this.amountPaid = 0;
    this.saleType = SalesType;
  }
}

class DeleteSale {
  constructor() {
    this.transactionId = 0;
    this.amountPaid = 0;
    this.customerId = undefined;
  }
}
