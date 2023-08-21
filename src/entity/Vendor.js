const { Base } = require("./Base");
const { Column, PrimaryColumn } = require("typeorm");
const { IsNotEmpty, Length, IsEmail } = require("class-validator");

class Vendor extends Base {
  constructor() {
    super();
  }

  id;
  name;
  description;
  address;
  mobile;
  email;
}

Vendor.prototype.id = PrimaryColumn();
Vendor.prototype.name = Column();
Vendor.prototype.description = Column({ nullable: true });
Vendor.prototype.address = Column();
Vendor.prototype.mobile = Column();
Vendor.prototype.email = Column();

Vendor.prototype.id = IsNotEmpty();
Vendor.prototype.name = IsNotEmpty();
Vendor.prototype.address = IsNotEmpty();
Vendor.prototype.mobile = Length(10, 10);
Vendor.prototype.email = IsNotEmpty();
Vendor.prototype.email = IsEmail();

module.exports = Vendor;
