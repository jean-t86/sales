const ProductRepo = require('../repos/product-repo.js');

module.exports = {
  async findAll(req, res) {
    const products = await ProductRepo.findAll();
    if (products) {
      res.status(200).send(products);
    } else {
      res.status(404).send();
    }
  },

  validateId(req, res, next, id) {
    const productId = Number(id);
    if (productId) {
      req.body.id = productId;
      next();
    } else {
      res.status(400).send();
    }
  },

  async findByPk(req, res) {
    const product = await ProductRepo.findByPk(req.body.id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send();
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

  async create(req, res) {
    const { name } = req.body;
    const { description } = req.body;
    const stock = Number(req.body.stock);

    const result = await ProductRepo.create(
      name,
      description,
      stock,
    );

    if (result) {
      res.status(201).send(result);
    } else {
      res.status(400).send();
    }
  },

  async update(req, res) {
    const { name } = req.body;
    const { description } = req.body;
    const stock = Number(req.body.stock);

    const result = await ProductRepo.update(
      req.body.id,
      name,
      description,
      stock,
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send();
    }
  },

  async delete(req, res) {
    const result = await ProductRepo.delete(req.body.id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  },
};
