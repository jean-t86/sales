const { Product } = require('../sequelize/models');

module.exports = {
  async findAll() {
    const products = await Product.findAll();
    return products;
  },
};
