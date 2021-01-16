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

  async create(name, description, stock) {
    const product = await Product.create({
      name,
      description,
      stock,
    });
    return product;
  },

  async update(id, name, description, stock) {
    const product = this.findByPk(id);
    let result = null;
    if (product) {
      result = await Product.update({
        name,
        description,
        stock,
      });
    }

    return result;
  },
};
