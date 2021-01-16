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

  async findByPk(req, res) {
    const id = Number(req.params.id);
    if (id) {
      const product = await ProductRepo.findByPk(id);
      if (product) {
        res.status(200).send(product);
      } else {
        res.status(404).send();
      }
    } else {
      res.status(400).send();
    }
  },

  async create(req, res) {
    const { name } = req.body;
    const { description } = req.body;
    const stock = Number(req.body.stock);

    if (name && stock) {
      const result = await ProductRepo.create(
        name,
        description,
        stock,
      );

      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send();
      }
    } else {
      res.status(400).send();
    }
  },

  async update(req, res) {
    const id = Number(req.params.id);
    if (id) {
      const { name } = req.body;
      const { description } = req.body;
      const { stock } = req.body;

      if (name && stock) {
        const result = ProductRepo.update(
          id,
          name,
          description,
          stock,
        );
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).send();
        }
      } else {
        res.status(400).send();
      }
    } else {
      res.status(400).send();
    }
  },
};
