const { Product } = require('../sequelize/models');

module.exports = {
  async findAll() {
    const products = await Product.findAll();
    return products;
  },

  async findByPk(id) {
    const product = await Product.findByPk(id);
    return product;
  },
};
