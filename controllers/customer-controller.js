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
};
