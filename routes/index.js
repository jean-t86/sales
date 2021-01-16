const express = require('express');
const ProductController = require('../controllers/product-controller.js');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/products', ProductController.findAll);
router.post('/products', ProductController.create);

module.exports = router;
