const express = require('express');
const ProductController = require('../controllers/product-controller.js');
const CustomerController = require('../controllers/customer-controller.js');
const OrderController = require('../controllers/order-controller.js');
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

router.get('/customers', CustomerController.findAll);
router.get('/customers/:id', CustomerController.findByPk);
router.post('/customers', Validators.validateCustomer, CustomerController.create);
router.put('/customers/:id', Validators.validateCustomer, CustomerController.update);
router.delete('/customers/:id', Validators.validateId, CustomerController.delete);

router.param('customerId', Validators.validateId);
router.param('productId', Validators.validateId);
router.get('/orders', OrderController.findAll);
router.get('/orders/:id', OrderController.findByPk);
router.get('/orders/customer/:customerId', OrderController.findByCustomerId);
router.post('/orders', Validators.validateOrder, OrderController.create);
router.post('/orders/:id/product/:productId', Validators.validateOrderLine, OrderController.addProduct);
router.put('/orders/:id', Validators.validateOrder, OrderController.update);
router.delete('/orders/:id', Validators.validateId, OrderController.delete);

module.exports = router;
