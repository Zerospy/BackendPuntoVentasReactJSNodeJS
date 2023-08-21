
const { Base } = require("./Base");

class Customer {
  constructor(id, name, description, address, mobile, email) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.address = address;
    this.mobile = mobile;
    this.email = email;
  }
}

module.exports = Customer;
