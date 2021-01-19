/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { before } = require('mocha');
const { expect, assert } = require('chai');
const sinon = require('sinon');
const faker = require('faker');
const request = require('supertest');
const server = require('../server.js');

describe('Customer route integration test', async function () {
  let customer;

  before(function (done) {
    if (server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  beforeEach(function () {
    server.listen(3000);

    customer = {
      id: faker.random.number(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    };
  });

  afterEach(function (done) {
    sinon.restore();
    server.close(done);
  });

  describe('GET customers', function () {
    it('returns 200 when called', async function () {
      await request(server)
        .get('/customers')
        .expect(200);
    });

    it('returns an array', function () {
      return request(server)
        .get('/customers')
        .expect(200)
        .then((res) => {
          const customers = res.body;
          expect(customers).to.nested.instanceOf(Array);
        });
    });
  });

  describe('POST customer', function () {
    it('returns 400 if firstName is missing', async function () {
      await request(server)
        .post('/customers')
        .send({
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(400);
    });

    it('returns 400 if lastName is missing', async function () {
      await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          email: customer.email,
        })
        .expect(400);
    });

    it('returns 400 if email is missing', async function () {
      await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
        })
        .expect(400);
    });

    it('returns 201 when no fields are missing', async function () {
      await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201);
    });

    it('returns the created customer', function () {
      return request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201)
        .then((res) => {
          const createdCustomer = res.body;
          assert.deepEqual(createdCustomer.firstName, customer.firstName);
          assert.deepEqual(createdCustomer.lastName, customer.lastName);
          assert.deepEqual(createdCustomer.email, customer.email);
        });
    });

    it('returns an id for the created customer', function () {
      return request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201)
        .then((res) => {
          const createdCustomer = res.body;
          expect(createdCustomer).to.haveOwnProperty('id');
          assert.ok(createdCustomer.id);
        });
    });
  });

  describe('GET customer by id', function () {
    it('retuns 400 if id is not a number', function () {
      const id = 'sdf';

      return request(server)
        .get(`/customers/${id}`)
        .expect(400);
    });

    it('returns 404 if customer not found', function () {
      const id = 40000;

      return request(server)
        .get(`/customers/${id}`)
        .expect(404);
    });

    it('returns a customer if found', async function () {
      const newCustomer = await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201);

      const response = await request(server)
        .get(`/customers/${newCustomer.body.id}`)
        .expect(200);

      assert.ok(response.body.firstName);
      assert.ok(response.body.lastName);
      assert.ok(response.body.email);
    });

    it('returns a customer with same id as parameter', async function () {
      const newCustomer = await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201);

      const response = await request(server)
        .get(`/customers/${newCustomer.body.id}`)
        .expect(200);
      assert.equal(response.body.id, newCustomer.body.id);
    });
  });

  describe('PUT customer by id', function () {
    const updatedCustomer = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    };

    it('returns 400 if id is not a number', function () {
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .expect(400);
    });

    it('returns 400 if firstName is missing', function () {
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(400);
    });

    it('returns 400 if lastName is missing', function () {
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          firstName: customer.firstName,
          email: customer.email,
        })
        .expect(400);
    });

    it('returns 400 if email is missing', function () {
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
        })
        .expect(400);
    });

    it('returns 404 if customer is not found', function () {
      const id = 40000;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(404);
    });

    it('returns the updated customer', async function () {
      const newCustomerRes = await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201);

      const response = await request(server)
        .put(`/customers/${newCustomerRes.body.id}`)
        .send({
          firstName: updatedCustomer.firstName,
          lastName: updatedCustomer.lastName,
          email: updatedCustomer.email,
        })
        .expect(200);

      assert.deepEqual(response.body.firstName, updatedCustomer.firstName);
      assert.deepEqual(response.body.lastName, updatedCustomer.lastName);
      assert.deepEqual(response.body.email, updatedCustomer.email);
    });

    it('returns the udpated customer with the same is passed in', async function () {
      const newCustomerRes = await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201);

      const response = await request(server)
        .put(`/customers/${newCustomerRes.body.id}`)
        .send({
          firstName: updatedCustomer.firstName,
          lastName: updatedCustomer.lastName,
          email: updatedCustomer.email,
        })
        .expect(200);

      assert.equal(response.body.id, newCustomerRes.body.id);
    });
  });

  describe('DELETE customer by id', function () {
    it('returns 400 if id is invalid', function () {
      const id = 'wer';

      return request(server)
        .delete(`/customers/${id}`)
        .expect(400);
    });

    it('returns 404 if customer is not found', function () {
      const id = 100000;

      return request(server)
        .delete(`/customers/${id}`)
        .expect(404);
    });

    it('returns 204 on successful delete', async function () {
      const response = await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201);

      await request(server)
        .delete(`/customers/${response.body.id}`)
        .expect(204);
    });
  });
});
