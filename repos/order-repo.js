const { Order } = require('../sequelize/models');

module.exports = {
  async findAll() {
    const orders = await Order.findAll();
    return orders;
  },

  async findByPk(id) {
    const order = await Order.findByPk(id);
    return order;
  },

  async create(customerId) {
    const customer = await Order.create({
      customerId,
    });
    return customer;
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
