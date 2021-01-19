/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { before } = require('mocha');
const { assert } = require('chai');
const sinon = require('sinon');
const faker = require('faker');
const request = require('supertest');
const server = require('../../server.js');
const CustomerRepo = require('../../../repos/customer-repo.js');

describe('Customer controller', function () {
  let customer;
  let customers;

  before(function (done) {
    if (server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  beforeEach(function () {
    customer = {
      id: faker.random.number(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
    };

    customers = [
      customer,
    ];
  });

  beforeEach(function () {
    server.listen(3000);
  });

  afterEach(function (done) {
    sinon.restore();
    server.close(done);
  });

  describe('findAll', function () {
    it('calls findAll on CustomerRepo', async function () {
      const fake = sinon.fake();
      sinon.replace(CustomerRepo, 'findAll', fake);

      await request(server)
        .get('/customers');

      assert.ok(fake.calledOnce);
    });

    it('returns 404 if customers are not found', async function () {
      const fake = sinon.fake();
      sinon.replace(CustomerRepo, 'findAll', fake);

      await request(server)
        .get('/customers')
        .expect(404);
    });

    it('returns 200 if customers found', async function () {
      const fake = sinon.fake.returns(customers);
      sinon.replace(CustomerRepo, 'findAll', fake);

      await request(server)
        .get('/customers')
        .expect(200);
    });

    it('returns the array of customers', async function () {
      const fake = sinon.fake.returns(customers);
      sinon.replace(CustomerRepo, 'findAll', fake);

      const response = await request(server)
        .get('/customers')
        .expect(200);

      assert.ok(response);
      assert.deepEqual(response.body, customers);
    });
  });
});
