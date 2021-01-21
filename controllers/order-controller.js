const OrderRepo = require('../repos/order-repo.js');

module.exports = {
  async findAll(req, res) {
    const orders = await OrderRepo.findAll();
    if (orders) {
      res.status(200).send(orders);
    } else {
      res.status(404).send();
    }
  },

  async findByPk(req, res) {
    const order = await OrderRepo.findByPk(req.body.id);
    if (order) {
      res.status(200).send(order);
    } else {
      res.status(404).send();
    }
  },

  async findByCustomerId(req, res) {
    const customers = await OrderRepo.findByCustomerId(req.body.id);
    if (customers) {
      res.status(200).send(customers);
    } else {
      res.status(404).send();
    }
  },

  async create(req, res) {
    const { customerId } = req.body;

    const result = await OrderRepo.create(
      customerId,
    );

    if (result) {
      res.status(201).send(result);
    } else {
      res.status(400).send();
    }
  },

  async addProduct(req, res) {
    const { orderId } = req.body;
    const { productId } = req.body;

    const result = await OrderRepo.addProduct(orderId, productId);

    if (result) {
      res.status(201).send(result);
    } else {
      res.status(400).send();
    }
  },

  async update(req, res) {
    const { customerId } = req.body;

    const result = await OrderRepo.update(
      req.body.id,
      customerId,
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send();
    }
  },

  async delete(req, res) {
    const result = await OrderRepo.delete(req.body.id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  },
};
