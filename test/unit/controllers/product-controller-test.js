/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { before } = require('mocha');
const { assert } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const server = require('../../../bin/www');
const ProductRepo = require('../../../repos/product-repo.js');

describe('Product controller', function () {
  const product = {
    id: 1,
    name: 'iPhone 12 Pro',
    description: 'The newest iPhone',
    stock: 12,
  };

  const products = [
    product,
  ];

  before(function (done) {
    if (server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  beforeEach(function () {
    server.listen(3000);
  });

  afterEach(function (done) {
    sinon.restore();
    server.close(done);
  });

  describe('findAll', function () {
    it('calls findAll on ProductRepo', async function () {
      const fake = sinon.fake();
      sinon.replace(ProductRepo, 'findAll', fake);

      await request(server)
        .get('/products');

      assert.ok(fake.calledOnce);
    });

    it('returns 404 if products are not found', async function () {
      const fake = sinon.fake();
      sinon.replace(ProductRepo, 'findAll', fake);

      await request(server)
        .get('/products')
        .expect(404);
    });

    it('returns 200 ifproducts found', async function () {
      const fake = sinon.fake.returns(products);
      sinon.replace(ProductRepo, 'findAll', fake);

      await request(server)
        .get('/products')
        .expect(200);
    });

    it('returns the array of products', async function () {
      const fake = sinon.fake.returns(products);
      sinon.replace(ProductRepo, 'findAll', fake);

      const response = await request(server)
        .get('/products')
        .expect(200);

      assert.ok(response);
      assert.deepEqual(response.body, products);
    });
  });

  describe('create', function () {
    it('calls create on ProductRepo', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'create', fake);

      await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(200);

      assert.ok(fake.calledOnce);
    });

    it('calls create with the correct arguments', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'create', fake);

      await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(200);

      assert.deepEqual(fake.getCall(0).args[0], product.name);
      assert.deepEqual(fake.getCall(0).args[1], product.description);
      assert.deepEqual(fake.getCall(0).args[2], product.stock);
    });

    it('returns 400 if name is undefined', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'create', fake);

      await request(server)
        .post('/products')
        .send({
          description: product.description,
          stock: product.stock,
        })
        .expect(400);
    });

    it('returns 400 if stock is undefined', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'create', fake);

      await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
        })
        .expect(400);
    });

    it('returns 400 if stock is not a number', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'create', fake);

      await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: 'sdf',
        })
        .expect(400);
    });

    it('returns 200 if description is missing', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'create', fake);

      await request(server)
        .post('/products')
        .send({
          name: product.name,
          stock: product.stock,
        })
        .expect(200);
    });

    it('returns the created product', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'create', fake);

      await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(200)
        .then((res) => {
          const createdProduct = res.body;
          assert.deepEqual(createdProduct, product);
        });
    });
  });

  describe('findByPk', function () {
    it('returns 400 if id is not a number', async function () {
      const fake = sinon.fake();
      sinon.replace(ProductRepo, 'findByPk', fake);
      const id = 'dsf';

      await request(server)
        .get(`/products/${id}`)
        .expect(400);
    });

    it('returns 404 is findByPk returns null', async function () {
      const fake = sinon.fake.returns(null);
      sinon.replace(ProductRepo, 'findByPk', fake);
      const id = '1';

      await request(server)
        .get(`/products/${id}`)
        .expect(404);
    });

    it('calls findByPk on product repository', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'findByPk', fake);
      const id = '1';

      await request(server)
        .get(`/products/${id}`)
        .expect(200);

      assert.ok(fake.calledOnce);
    });

    it('calls findByPk with the id as argument', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'findByPk', fake);
      const id = '1';

      await request(server)
        .get(`/products/${id}`)
        .expect(200);

      assert.equal(fake.getCall(0).args[0], id);
    });

    it('returns a product if found', function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'findByPk', fake);
      const id = '1';

      return request(server)
        .get(`/products/${id}`)
        .expect(200)
        .then((res) => {
          const fetchedProduct = res.body;
          assert.deepEqual(fetchedProduct.id, product.id);
          assert.deepEqual(fetchedProduct.name, product.name);
          assert.deepEqual(fetchedProduct.description, product.description);
          assert.deepEqual(fetchedProduct.stock, product.stock);
        });
    });
  });

  describe('update', function () {
    it('returns 400 if id is not a number', function () {
      const id = 'dsf';

      return request(server)
        .put(`/products/${id}`)
        .expect(400);
    });

    it('returns 400 if name is missing', function () {
      const id = 3;

      return request(server)
        .put(`/products/${id}`)
        .send({
          description: product.description,
          stock: product.stock,
        })
        .expect(400);
    });

    it('returns 400 if stock is missing', function () {
      const id = 3;

      return request(server)
        .put(`/products/${id}`)
        .send({
          name: product.name,
          description: product.description,
        })
        .expect(400);
    });

    it('returns 404 if product cannot be found', function () {
      const fake = sinon.fake.returns(null);
      sinon.replace(ProductRepo, 'update', fake);
      const id = 3;

      return request(server)
        .put(`/products/${id}`)
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(404);
    });

    it('returns 200 if update was successful', function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'update', fake);
      const id = 3;

      return request(server)
        .put(`/products/${id}`)
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(200);
    });

    it('returns the updated product', function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'update', fake);
      const id = 3;

      return request(server)
        .put(`/products/${id}`)
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(200)
        .then((res) => {
          assert.deepEqual(res.body, product);
        });
    });

    it('returns the same id as the passed parameter', function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'update', fake);
      const id = 1;

      return request(server)
        .put(`/products/${id}`)
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(200)
        .then((res) => {
          assert.equal(res.body.id, id);
        });
    });
  });

  describe('delete', function () {
    it('returns 400 if id is not valid', function () {
      const id = 'wer';

      return request(server)
        .delete(`/products/${id}`)
        .expect(400);
    });

    it('returns 404 if product is not found', function () {
      const fake = sinon.fake.returns(0);
      sinon.replace(ProductRepo, 'delete', fake);
      const id = 1;

      return request(server)
        .delete(`/products/${id}`)
        .expect(404);
    });

    it('calls delete on product repository', function () {
      const fake = sinon.fake();
      sinon.replace(ProductRepo, 'delete', fake);
      const id = 1;

      return request(server)
        .delete(`/products/${id}`)
        .expect(404)
        .then(() => {
          assert.ok(fake.calledOnce);
        });
    });

    it('calls delete on repository with id as parameter', function () {
      const fake = sinon.fake();
      sinon.replace(ProductRepo, 'delete', fake);
      const id = 1;

      return request(server)
        .delete(`/products/${id}`)
        .expect(404)
        .then(() => {
          assert.equal(fake.getCall(0).args[0], id);
        });
    });

    it('returns 204 on successful delete', function () {
      const fake = sinon.fake.returns(1);
      sinon.replace(ProductRepo, 'delete', fake);
      const id = 1;

      return request(server)
        .delete(`/products/${id}`)
        .expect(204);
    });
  });
});
