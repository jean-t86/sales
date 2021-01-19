const { Customer } = require('../sequelize/models');

module.exports = {
  async findAll() {
    const products = await Customer.findAll();
    return products;
  },

  async findByPk(id) {
    const product = await Customer.findByPk(id);
    return product;
  },
};
