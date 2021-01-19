const { Customer } = require('../sequelize/models');

module.exports = {
  async findAll() {
    const customers = await Customer.findAll();
    return customers;
  },

  async findByPk(id) {
    const customer = await Customer.findByPk(id);
    return customer;
  },

  async create(firstName, lastName, email) {
    const customer = await Customer.create({
      firstName,
      lastName,
      email,
    });
    return customer;
  },

  async update(id, firstName, lastName, email) {
    const result = await Customer.update(
      {
        firstName,
        lastName,
        email,
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
};
