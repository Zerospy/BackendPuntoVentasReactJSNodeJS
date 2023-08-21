const { UpdateDateColumn, CreateDateColumn, ManyToOne } = require("typeorm");
const { User } = require("./User");
const { Exclude } = require("class-transformer");

class Base {
  constructor() {
    this.createdAt = undefined;
    this.updatedAt = undefined;
    this.createdBy = undefined;
    this.updatedBy = undefined;
  }
} 

Exclude()(Base.prototype, "createdAt");
CreateDateColumn()(Base.prototype, "createdAt");

Exclude()(Base.prototype, "updatedAt");
UpdateDateColumn()(Base.prototype, "updatedAt");

Exclude()(Base.prototype, "createdBy");
ManyToOne(type => User, {
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
  nullable: false
})(Base.prototype, "createdBy");

Exclude()(Base.prototype, "updatedBy");
ManyToOne(type => User, {
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
  nullable: false
})(Base.prototype, "updatedBy");
