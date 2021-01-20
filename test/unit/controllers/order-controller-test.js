/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { before } = require('mocha');
const { assert } = require('chai');
const sinon = require('sinon');
const faker = require('faker');
const request = require('supertest');
const server = require('../../server.js');
const OrderRepo = require('../../../repos/order-repo.js');

describe('Order controller', function () {
  let order;
  let orders;

  before(function (done) {
    if (server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  beforeEach(function () {
    order = {
      id: faker.random.number(),
      customerId: faker.random.number(),
    };

    orders = [
      order,
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
    it('calls findAll on OrderRepo', async function () {
      const fake = sinon.fake();
      sinon.replace(OrderRepo, 'findAll', fake);

      await request(server)
        .get('/orders');

      assert.ok(fake.calledOnce);
    });

    it('returns 404 if orders are not found', async function () {
      const fake = sinon.fake();
      sinon.replace(OrderRepo, 'findAll', fake);

      await request(server)
        .get('/orders')
        .expect(404);
    });

    it('returns 200 if orders found', async function () {
      const fake = sinon.fake.returns(orders);
      sinon.replace(OrderRepo, 'findAll', fake);

      await request(server)
        .get('/orders')
        .expect(200);
    });

    it('returns the array of orders', async function () {
      const fake = sinon.fake.returns(orders);
      sinon.replace(OrderRepo, 'findAll', fake);

      const response = await request(server)
        .get('/orders')
        .expect(200);

      assert.ok(response);
      assert.deepEqual(response.body, orders);
    });
  });

  describe('create', function () {
    it('calls create on OrderRepo', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'create', fake);

      await request(server)
        .post('/orders')
        .send({
          customerId: order.customerId,
        })
        .expect(201);

      assert.ok(fake.calledOnce);
    });

    it('calls create with the correct arguments', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'create', fake);

      await request(server)
        .post('/orders')
        .send({
          customerId: order.customerId,
        })
        .expect(201);

      assert.deepEqual(fake.getCall(0).args[0], order.customerId);
      assert.deepEqual(fake.getCall(0).args[1], order.lastName);
      assert.deepEqual(fake.getCall(0).args[2], order.email);
    });

    it('returns 400 if customerId is undefined', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'create', fake);

      await request(server)
        .post('/orders')
        .send()
        .expect(400);
    });

    it('returns 400 if customerId is invalid', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'create', fake);
      const customerId = 'df';

      await request(server)
        .post('/orders')
        .send({
          customerId,
        })
        .expect(400);
    });

    it('returns the created order', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'create', fake);

      await request(server)
        .post('/orders')
        .send({
          customerId: order.customerId,
        })
        .expect(201)
        .then((res) => {
          const createdOrder = res.body;
          assert.deepEqual(createdOrder, order);
        });
    });
  });

  describe('findByPk', function () {
    it('returns 400 if id is not a number', async function () {
      const fake = sinon.fake();
      sinon.replace(OrderRepo, 'findByPk', fake);
      const id = 'dsf';

      await request(server)
        .get(`/orders/${id}`)
        .expect(400);
    });

    it('returns 404 if findByPk returns null', async function () {
      const fake = sinon.fake.returns(null);
      sinon.replace(OrderRepo, 'findByPk', fake);
      const { id } = order;

      await request(server)
        .get(`/orders/${id}`)
        .expect(404);
    });

    it('calls findByPk on order repository', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'findByPk', fake);
      const { id } = order;

      await request(server)
        .get(`/orders/${id}`)
        .expect(200);

      assert.ok(fake.calledOnce);
    });

    it('calls findByPk with the id as argument', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'findByPk', fake);
      const { id } = order;

      await request(server)
        .get(`/orders/${id}`)
        .expect(200);

      assert.equal(fake.getCall(0).args[0], id);
    });

    it('returns an order if found', function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'findByPk', fake);
      const { id } = order;

      return request(server)
        .get(`/orders/${id}`)
        .expect(200)
        .then((res) => {
          const fetchedOrder = res.body;
          assert.deepEqual(fetchedOrder.id, order.id);
          assert.deepEqual(fetchedOrder.customerId, order.customerId);
        });
    });
  });

  describe('findByCustomerId', function () {
    it('returns 400 if customerId is not a number', async function () {
      const fake = sinon.fake();
      sinon.replace(OrderRepo, 'findByCustomerId', fake);
      const customerId = 'dsf';

      await request(server)
        .get(`/orders/customer/${customerId}`)
        .expect(400);
    });

    it('returns 404 if no orders found', async function () {
      const fake = sinon.fake.returns(null);
      sinon.replace(OrderRepo, 'findByCustomerId', fake);
      const { customerId } = order;

      await request(server)
        .get(`/orders/customer/${customerId}`)
        .expect(404);
    });

    it('calls findByCustomerId on OrderRepo', async function () {
      const fake = sinon.fake();
      sinon.replace(OrderRepo, 'findByCustomerId', fake);
      const { customerId } = order;

      await request(server)
        .get(`/orders/customer/${customerId}`);

      assert.ok(fake.calledOnce);
    });

    it('calls findByCustomerId with the customerId as argument', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'findByCustomerId', fake);
      const { customerId } = order;

      await request(server)
        .get(`/orders/customer/${customerId}`)
        .expect(200);

      assert.equal(fake.getCall(0).args[0], customerId);
    });

    it('returns an array of orders if found', async function () {
      const fake = sinon.fake.returns(orders);
      sinon.replace(OrderRepo, 'findByCustomerId', fake);
      const { customerId } = order;

      const response = await request(server)
        .get(`/orders/customer/${customerId}`)
        .expect(200);

      assert.deepEqual(response.body, orders);
    });
  });

  describe('update', function () {
    it('returns 400 if id is not a number', function () {
      const id = 'dsf';

      return request(server)
        .put(`/orders/${id}`)
        .expect(400);
    });

    it('returns 400 if customerId is missing', function () {
      const { id } = order;

      return request(server)
        .put(`/orders/${id}`)
        .send({})
        .expect(400);
    });

    it('returns 404 if order cannot be found', function () {
      const fake = sinon.fake.returns(null);
      sinon.replace(OrderRepo, 'update', fake);
      const { id } = order;

      return request(server)
        .put(`/orders/${id}`)
        .send({
          customerId: order.customerId,
        })
        .expect(404);
    });

    it('returns 400 if customerId is invalid', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'update', fake);
      const { id } = order;
      const customerId = 'df';

      await request(server)
        .put(`/orders/${id}`)
        .send({
          customerId,
        })
        .expect(400);
    });

    it('returns 200 if update was successful', function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'update', fake);
      const { id } = order;

      return request(server)
        .put(`/orders/${id}`)
        .send({
          customerId: order.customerId,
        })
        .expect(200);
    });

    it('returns the updated order', function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'update', fake);
      const { id } = order;

      return request(server)
        .put(`/orders/${id}`)
        .send({
          customerId: order.customerId,
        })
        .expect(200)
        .then((res) => {
          assert.deepEqual(res.body, order);
        });
    });

    it('returns the same id as the passed parameter', function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(OrderRepo, 'update', fake);
      const { id } = order;

      return request(server)
        .put(`/orders/${id}`)
        .send({
          customerId: order.customerId,
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
        .delete(`/orders/${id}`)
        .expect(400);
    });

    it('returns 404 if order is not found', function () {
      const fake = sinon.fake.returns(0);
      sinon.replace(OrderRepo, 'delete', fake);
      const { id } = order;

      return request(server)
        .delete(`/orders/${id}`)
        .expect(404);
    });

    it('calls delete on order repository', function () {
      const fake = sinon.fake();
      sinon.replace(OrderRepo, 'delete', fake);
      const { id } = order;

      return request(server)
        .delete(`/orders/${id}`)
        .expect(404)
        .then(() => {
          assert.ok(fake.calledOnce);
        });
    });

    it('calls delete on repository with id as parameter', function () {
      const fake = sinon.fake();
      sinon.replace(OrderRepo, 'delete', fake);
      const { id } = order;

      return request(server)
        .delete(`/orders/${id}`)
        .expect(404)
        .then(() => {
          assert.equal(fake.getCall(0).args[0], id);
        });
    });

    it('returns 204 on successful delete', function () {
      const fake = sinon.fake.returns(1);
      sinon.replace(OrderRepo, 'delete', fake);
      const { id } = order;

      return request(server)
        .delete(`/orders/${id}`)
        .expect(204);
    });
  });
});
