const express = require('express');
const ProductController = require('../controllers/product-controller.js');
const CustomerController = require('../controllers/customer-controller.js');
const Validators = require('../controllers/validators.js');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.param('id', Validators.validateId);
router.get('/products', ProductController.findAll);
router.get('/products/:id', ProductController.findByPk);
router.post('/products', Validators.validateProduct, ProductController.create);
router.put('/products/:id', Validators.validateProduct, ProductController.update);
router.delete('/products/:id', ProductController.delete);

router.param('id', Validators.validateId);
router.get('/customers', CustomerController.findAll);
router.get('/customers/:id', CustomerController.findByPk);
router.post('/customers', Validators.validateCustomer, CustomerController.create);

module.exports = router;
