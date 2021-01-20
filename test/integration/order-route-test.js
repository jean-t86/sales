/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { before } = require('mocha');
const { expect, assert } = require('chai');
const sinon = require('sinon');
const faker = require('faker');
const request = require('supertest');
const server = require('../server.js');

/**
 * Because of referential integrity constraint on the customerId foreign key,
 * each order created needs to be associated with a valid customer record.
 * This helper method creates the customer.
 * @return {number} The id of the customer created.
 */
async function createCustomer() {
  const newCustomer = await request(server)
    .post('/customers')
    .send({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    })
    .expect(201);
  return newCustomer.body.id;
}

describe('Order route integration test', async function () {
  let order;

  before(function (done) {
    if (server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  beforeEach(function () {
    server.listen(3000);

    order = {
      id: faker.random.number(),
      customerId: faker.random.number(),
    };
  });

  afterEach(function (done) {
    sinon.restore();
    server.close(done);
  });

  describe('GET orders', function () {
    it('returns 200 when called', async function () {
      await request(server)
        .get('/orders')
        .expect(200);
    });

    it('returns an array', function () {
      return request(server)
        .get('/orders')
        .expect(200)
        .then((res) => {
          const orders = res.body;
          expect(orders).to.nested.instanceOf(Array);
        });
    });
  });

  describe('POST order', function () {
    it('returns 400 if customerId is missing', async function () {
      await request(server)
        .post('/orders')
        .send()
        .expect(400);
    });

    it('returns 201 when no fields are missing', async function () {
      const customerId = await createCustomer();

      await request(server)
        .post('/orders')
        .send({
          customerId,
        })
        .expect(201);
    });

    it('returns the created order', async function () {
      const customerId = await createCustomer();

      const response = await request(server)
        .post('/orders')
        .send({
          customerId,
        })
        .expect(201);

      const createdOrder = response.body;
      assert.deepEqual(createdOrder.customerId, customerId);
    });

    it('returns an id for the created order', async function () {
      const customerId = await createCustomer();

      const response = await request(server)
        .post('/orders')
        .send({
          customerId,
        })
        .expect(201);

      const createdOrder = response.body;
      expect(createdOrder).to.haveOwnProperty('id');
      assert.ok(createdOrder.id);
    });
  });

  describe('GET order by id', function () {
    it('retuns 400 if id is not a number', function () {
      const id = 'sdf';

      return request(server)
        .get(`/orders/${id}`)
        .expect(400);
    });

    it('returns 404 if order not found', function () {
      const id = 40000;

      return request(server)
        .get(`/orders/${id}`)
        .expect(404);
    });

    it('returns an order if found', async function () {
      const customerId = await createCustomer();

      const newOrder = await request(server)
        .post('/orders')
        .send({
          customerId,
        })
        .expect(201);

      const response = await request(server)
        .get(`/orders/${newOrder.body.id}`)
        .expect(200);

      assert.ok(response.body.customerId);
    });

    it('returns an order with same id as parameter', async function () {
      const customerId = await createCustomer();

      const newOrder = await request(server)
        .post('/orders')
        .send({
          customerId,
        })
        .expect(201);

      const response = await request(server)
        .get(`/orders/${newOrder.body.id}`)
        .expect(200);
      assert.equal(response.body.id, newOrder.body.id);
    });
  });

  describe('GET order by customerId', function () {
    it('retuns 400 if id is not a number', function () {
      const customerId = 'pdi';

      return request(server)
        .get(`/orders/customer/${customerId}`)
        .expect(400);
    });

    it('returns an array', function () {
      const { customerId } = order;
      return request(server)
        .get(`/orders/customer/${customerId}`)
        .expect(200)
        .then((res) => {
          const orders = res.body;
          expect(orders).to.nested.instanceOf(Array);
        });
    });
  });

  describe('PUT order by id', function () {
    it('returns 400 if id is not a number', function () {
      const { id } = order;

      return request(server)
        .put(`/orders/${id}`)
        .expect(400);
    });

    it('returns 400 if customerId is missing', function () {
      const { id } = order;

      return request(server)
        .put(`/orders/${id}`)
        .send()
        .expect(400);
    });

    it('returns 404 if order is not found', function () {
      const id = 40000;

      return request(server)
        .put(`/orders/${id}`)
        .send({
          customerId: order.customerId,
        })
        .expect(404);
    });

    it('returns the updated order', async function () {
      const firstCustomerId = await createCustomer();

      const newOrderRes = await request(server)
        .post('/orders')
        .send({
          customerId: firstCustomerId,
        })
        .expect(201);

      const secondCustomerId = await createCustomer();

      const response = await request(server)
        .put(`/orders/${newOrderRes.body.id}`)
        .send({
          customerId: secondCustomerId,
        })
        .expect(200);

      assert.deepEqual(response.body.customerId, secondCustomerId);
    });

    it('returns the udpated order with the same id passed in', async function () {
      const firstCustomerId = await createCustomer();

      const newOrderRes = await request(server)
        .post('/orders')
        .send({
          customerId: firstCustomerId,
        })
        .expect(201);

      const secondCustomerId = await createCustomer();

      const response = await request(server)
        .put(`/orders/${newOrderRes.body.id}`)
        .send({
          customerId: secondCustomerId,
        })
        .expect(200);

      assert.equal(response.body.id, newOrderRes.body.id);
    });
  });

  describe('DELETE order by id', function () {
    it('returns 400 if id is invalid', function () {
      const id = 'wer';

      return request(server)
        .delete(`/orders/${id}`)
        .expect(400);
    });

    it('returns 404 if order is not found', function () {
      const id = 100000;

      return request(server)
        .delete(`/orders/${id}`)
        .expect(404);
    });

    it('returns 204 on successful delete', async function () {
      const customerId = await createCustomer();

      const response = await request(server)
        .post('/orders')
        .send({
          customerId,
        })
        .expect(201);

      await request(server)
        .delete(`/orders/${response.body.id}`)
        .expect(204);
    });
  });
});
