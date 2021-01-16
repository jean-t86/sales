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
};
