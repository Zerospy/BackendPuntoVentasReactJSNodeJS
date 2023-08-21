const { openConnection } = require("../persistence");
const { User, Role } = require("../entity/User");
const { getManager } = require("typeorm");
const { ProductType } = require("../entity/ProductType");
const { Product } = require("../entity/Product");
const { Customer } = require("../entity/Customer");

const ADMIN_USER_ID = "admin";

class Seed {
  static async run() {
    await openConnection();
    await Seed.addUsers();
    await Seed.addProductTypes();
    await Seed.addProducts();
    await Seed.addCustomer();
  }

  static async addCustomer() {
    const customer = new Customer();
    customer.id = "shan";
    customer.name = "shan sfk";
    customer.address = "mi dirección";
    customer.description = "cliente de prueba";
    customer.email = "correo@mail.com";
    customer.mobile = "1234567899";
    customer.createdBy = "admin";
    customer.updatedBy = "admin";

    await getManager().insert(Customer, customer);
  }

  static async addProducts() {
    const pen = new Product();
    pen.id = "pen";
    pen.name = "pen";
    pen.description = "pluma genial";
    pen.costPrice = 10;
    pen.sellingPrice = 20;
    pen.productTypeId = "stat";
    pen.createdBy = ADMIN_USER_ID;
    pen.updatedBy = ADMIN_USER_ID;

    await getManager().insert(Product, pen);

    const pencil = new Product();
    pencil.id = "pencil";
    pencil.description = "lápiz genial";
    pencil.name = "lápiz apsara";
    pencil.costPrice = 5;
    pencil.sellingPrice = 10;
    pencil.productTypeId = "stat";
    pencil.createdBy = ADMIN_USER_ID;
    pencil.updatedBy = ADMIN_USER_ID;

    await getManager().insert(Product, pencil);

    const notebook = new Product();
    notebook.id = "notebook";
    notebook.description = "cuaderno genial";
    notebook.name = "cuaderno papermate";
    notebook.costPrice = 50;
    notebook.sellingPrice = 70;
    notebook.productTypeId = "stat";
    notebook.createdBy = ADMIN_USER_ID;
    notebook.updatedBy = ADMIN_USER_ID;

    await getManager().insert(Product, notebook);
  }

  static async addProductTypes() {
    const stat = new ProductType();
    stat.id = "stat";
    stat.description = "artículos de papelería";
    stat.createdBy = ADMIN_USER_ID;
    stat.updatedBy = ADMIN_USER_ID;

    await getManager().insert(ProductType, stat);
  }

  static async addUsers() {
    const admin = new User();
    admin.id = ADMIN_USER_ID;
    admin.name = ADMIN_USER_ID;
    admin.password = ADMIN_USER_ID;
    admin.role = Role.Admin;

    await getManager().insert(User, admin);
  }
}

module.exports = { Seed };
