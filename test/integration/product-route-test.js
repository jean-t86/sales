/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { before } = require('mocha');
const { expect, assert } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const server = require('../../bin/www');

describe('Product route integration test', async function () {
  const product = {
    id: 1,
    name: 'iPhone 12 Pro',
    description: 'The newest iPhone',
    stock: 12,
  };

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

  describe('GET products', function () {
    it('returns 200 when called', async function () {
      await request(server)
        .get('/products')
        .expect(200);
    });

    it('returns an array', function () {
      return request(server)
        .get('/products')
        .expect(200)
        .then((res) => {
          const products = res.body;
          expect(products).to.nested.instanceOf(Array);
        });
    });
  });

  describe('POST product', function () {
    it('returns 400 if name is missing', async function () {
      await request(server)
        .post('/products')
        .send({
          description: product.description,
          stock: product.stock,
        })
        .expect(400);
    });

    it('returns 400 if stock is missing', async function () {
      await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
        })
        .expect(400);
    });

    it('returns 201 when name and stock are not missing', async function () {
      await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(201);
    });

    it('returns the created product', function () {
      return request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(201)
        .then((res) => {
          const createdProduct = res.body;
          assert.deepEqual(createdProduct.name, product.name);
          assert.deepEqual(createdProduct.description, product.description);
          assert.deepEqual(createdProduct.stock, product.stock);
        });
    });

    it('returns an id for the created product', function () {
      return request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(201)
        .then((res) => {
          const createdProduct = res.body;
          expect(createdProduct).to.haveOwnProperty('id');
          assert.ok(createdProduct.id);
        });
    });
  });

  describe('GET product by id', function () {
    it('retuns 400 if id is not a number', function () {
      const id = 'sdf';

      return request(server)
        .get(`/products/${id}`)
        .expect(400);
    });

    it('returns 404 if product not found', function () {
      const id = 40000;

      return request(server)
        .get(`/products/${id}`)
        .expect(404);
    });

    it('returns a product if found', async function () {
      const newProduct = await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(201);

      const response = await request(server)
        .get(`/products/${newProduct.body.id}`)
        .expect(200);

      assert.ok(response.body.name);
      assert.ok(response.body.description);
      assert.ok(response.body.stock);
    });

    it('returns a product with same id as parameter', async function () {
      const newProduct = await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(201);

      const response = await request(server)
        .get(`/products/${newProduct.body.id}`)
        .expect(200);
      assert.equal(response.body.id, newProduct.body.id);
    });
  });

  describe('PUT product by id', function () {
    const updatedProduct = {
      name: 'iPad Air',
      description: 'The newest iPad',
      stock: 5,
    };

    it('returns 400 if id is not a number', function () {
      const id = 4;

      return request(server)
        .put(`/products/${id}`)
        .expect(400);
    });

    it('returns 400 if name is missing', function () {
      const id = 4;

      return request(server)
        .put(`/products/${id}`)
        .send({
          description: product.description,
          stock: product.stock,
        })
        .expect(400);
    });

    it('returns 400 if stock is missing', function () {
      const id = 4;

      return request(server)
        .put(`/products/${id}`)
        .send({
          name: product.name,
          description: product.description,
        })
        .expect(400);
    });

    it('returns 404 if product is not found', function () {
      const id = 40000;

      return request(server)
        .put(`/products/${id}`)
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(404);
    });

    it('returns the updated product', async function () {
      const newProductRes = await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(201);

      const response = await request(server)
        .put(`/products/${newProductRes.body.id}`)
        .send({
          name: updatedProduct.name,
          description: updatedProduct.description,
          stock: updatedProduct.stock,
        })
        .expect(200);

      assert.deepEqual(response.body.name, updatedProduct.name);
      assert.deepEqual(response.body.description, updatedProduct.description);
      assert.deepEqual(response.body.stock, updatedProduct.stock);
    });

    it('returns the udpated product with the same is passed in', async function () {
      const newProductRes = await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(201);

      const response = await request(server)
        .put(`/products/${newProductRes.body.id}`)
        .send({
          name: updatedProduct.name,
          description: updatedProduct.description,
          stock: updatedProduct.stock,
        })
        .expect(200);

      assert.equal(response.body.id, newProductRes.body.id);
    });
  });

  describe('DELETE product by id', function () {
    it('returns 400 if id is invalid', function () {
      const id = 'wer';

      return request(server)
        .delete(`/products/${id}`)
        .expect(400);
    });

    it('returns 404 if product is not found', function () {
      const id = 100000;

      return request(server)
        .delete(`/products/${id}`)
        .expect(404);
    });

    it('returns 204 on successful delete', async function () {
      const response = await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(201);

      await request(server)
        .delete(`/products/${response.body.id}`)
        .expect(204);
    });
  });
});
