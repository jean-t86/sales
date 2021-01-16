const express = require('express');
const ProductController = require('../controllers/product-controller.js');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/products', ProductController.findAll);
router.get('/products/:id', ProductController.findByPk);
router.post('/products', ProductController.create);
router.put('/products/:id', ProductController.update);

module.exports = router;
