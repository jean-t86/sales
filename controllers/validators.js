module.exports = {
  validateId(req, res, next, id) {
    const productId = Number(id);
    if (productId) {
      req.body.id = productId;
      next();
    } else {
      res.status(400).send();
    }
  },

  validateProduct(req, res, next) {
    const { name } = req.body;
    const stock = Number(req.body.stock);

    if (name && stock) {
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
};
