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
};
