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
});
