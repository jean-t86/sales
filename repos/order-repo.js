const { Order } = require('../sequelize/models');
const { Product } = require('../sequelize/models');
const { OrderLine } = require('../sequelize/models');

module.exports = {
  async findAll() {
    const orders = await Order.findAll({
      include: [{
        model: Product,
        through: { attributes: [] },
      }],
    });
    return orders;
  },

  async findByPk(id) {
    const order = await Order.findByPk(id, {
      include: [{
        model: Product,
        through: { attributes: [] },
      }],
    });
    return order;
  },

  async findByCustomerId(customerId) {
    const result = await Order.findAll({
      where: {
        customerId,
      },
    });
    return result;
  },

  async create(customerId) {
    const customer = await Order.create({
      customerId,
    });
    return customer;
  },

  async addProduct(id, productId) {
    const result = await OrderLine.create({
      orderId: id,
      productId,
    });

    if (!result) return null;
    return this.findByPk(id);
  },

  async update(id, customerId) {
    const result = await Order.update(
      {
        customerId,
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
    const result = await Order.destroy({
      where: {
        id,
      },
    });
    return result;
  },
};
