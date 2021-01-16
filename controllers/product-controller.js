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
};
