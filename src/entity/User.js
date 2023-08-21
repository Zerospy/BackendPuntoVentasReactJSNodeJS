const { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } = require("typeorm");
const { IsNotEmpty, IsEnum } = require("class-validator");

const Role = {
  Admin: 0,
  NonAdmin: 1
};

class User {
  constructor(id, name, password, role, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

User.prototype.id = undefined;
User.prototype.name = undefined;
User.prototype.password = undefined;
User.prototype.role = undefined;
User.prototype.createdAt = undefined;
User.prototype.updatedAt = undefined;

module.exports = {
  User
};
