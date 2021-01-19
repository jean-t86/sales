const express = require('express');
const ProductController = require('../controllers/product-controller.js');
const CustomerController = require('../controllers/customer-controller.js');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.param('id', ProductController.validateId);
router.get('/products', ProductController.findAll);
router.get('/products/:id', ProductController.findByPk);
router.post('/products', ProductController.validateProduct, ProductController.create);
router.put('/products/:id', ProductController.validateProduct, ProductController.update);
router.delete('/products/:id', ProductController.delete);

router.get('/customers', CustomerController.findAll);

module.exports = router;
