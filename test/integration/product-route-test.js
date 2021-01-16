/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { before } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const server = require('../../bin/www');

describe('Product route integration test', async function () {
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
});
