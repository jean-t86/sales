const { ErrorResponse } = require('../helpers/error.js');
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

  async findByPk(req, res) {
    const customer = await CustomerRepo.findByPk(req.body.id);
    if (customer) {
      res.status(200).send(customer);
    } else {
      res.status(404).send();
    }
  },

  async create(req, res, next) {
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;

    let result;
    try {
      result = await CustomerRepo.create(
        firstName,
        lastName,
        email,
      );
    } catch (err) {
      next(new ErrorResponse(500, err.message));
      return;
    }

    if (result) {
      res.status(201).send(result);
    } else {
      res.status(400).send();
    }
  },

  async update(req, res, next) {
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;

    let result;
    try {
      result = await CustomerRepo.update(
        req.body.id,
        firstName,
        lastName,
        email,
      );
    } catch (err) {
      next(new ErrorResponse(500, err.message));
      return;
    }

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send();
    }
  },

  async delete(req, res) {
    const result = await CustomerRepo.delete(req.body.id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  },
};
