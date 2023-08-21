const { createConnection } = require('typeorm');

const configDev = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [__dirname + '/../entity/*.ts'],
  migrations: [__dirname + '/../persistence/migration/*.ts'],
  logging: true,
  synchronize: false
};

const configProd = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [__dirname + '/../entity/*.js'],
  migrations: [__dirname + '/../persistence/migration/*.js'],
  logging: true,
  synchronize: false
};

const openConnection = async () => {
  const config = process.env.IS_PROD ? configProd : configDev;
  return await createConnection(config);
};

module.exports = {
  openConnection
};
