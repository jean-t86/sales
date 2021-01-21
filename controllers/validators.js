module.exports = {
  validateId(req, res, next, id) {
    const resourceId = Number(id);
    if (resourceId) {
      req.body.id = resourceId;
      next();
    } else {
      res.status(400).send();
    }
  },

  validateProduct(req, res, next) {
    const { name } = req.body;
    const stock = Number(req.body.stock);

    if (name && !Number.isNaN(stock)) {
      next();
    } else {
      res.status(400).send();
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

  validateOrder(req, res, next) {
    const customerId = Number(req.body.customerId);

    if (customerId) {
      next();
    } else {
      res.status(400).send();
    }
  },

  validateOrderLine(req, res, next) {
    const id = Number(req.params.id);
    const productId = Number(req.params.productId);

    if (id && productId) {
      req.body.orderId = id;
      req.body.productId = productId;
      next();
    } else {
      res.status(400).send();
    }
  },
};
