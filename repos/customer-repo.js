const { Customer } = require('../sequelize/models');

module.exports = {
  async findAll() {
    const products = await Customer.findAll();
    return products;
  },
};
