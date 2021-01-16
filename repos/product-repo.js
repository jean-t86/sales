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
    const result = await Product.update(
      {
        name,
        description,
        stock,
      },
      {
        where: {
          id,
        },
        returning: true,
      },
    );

    if (result && result[0]) return result[1][0];
    return null;
  },

  async delete(id) {
    const result = await Product.destroy({
      where: {
        id,
      },
    });
    return result;
  },
};
