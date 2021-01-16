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

    it('returns 200 when name and stock are not missing', async function () {
      await request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(200);
    });

    it('returns the created product', function () {
      return request(server)
        .post('/products')
        .send({
          name: product.name,
          description: product.description,
          stock: product.stock,
        })
        .expect(200)
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
        .expect(200)
        .then((res) => {
          const createdProduct = res.body;
          expect(createdProduct).to.haveOwnProperty('id');
          assert.ok(createdProduct.id);
        });
    });
  });
});
