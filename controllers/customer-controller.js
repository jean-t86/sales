const CustomerRepo = require('../repos/customer-repo.js');

module.exports = {
  async findAll(req, res) {
    const customers = await CustomerRepo.findAll();
    if (customers) {
      res.status(200).send(customers);
    } else {
      res.status(404).send();
    }
  },

  validateId(req, res, next, id) {
    const customerId = Number(id);
    if (customerId) {
      req.body.id = customerId;
      next();
    } else {
      res.status(400).send();
    }
  },

  async findByPk(req, res) {
    const customer = await CustomerRepo.findByPk(req.body.id);
    if (customer) {
      res.status(200).send(customer);
    } else {
      res.status(404).send();
    }
  },

  validateCustomer(req, res, next) {
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;

    if (firstName && lastName && email) {
      next();
    } else {
      res.status(400).send();
    }
  },

  async create(req, res) {
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;

    const result = await CustomerRepo.create(
      firstName,
      lastName,
      email,
    );

    if (result) {
      res.status(201).send(result);
    } else {
      res.status(400).send();
    }
  },

};
