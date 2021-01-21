/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const sinon = require('sinon');
const { assert } = require('chai');
const faker = require('faker');
const { Product } = require('../../../sequelize/models');
const { Order } = require('../../../sequelize/models');
const OrderRepo = require('../../../repos/order-repo.js');

describe('OrderRepo', function () {
  let order;
  let orders;

  beforeEach(function () {
    order = {
      id: faker.random.number(),
      customerId: faker.random.number(),
    };

    orders = [
      order,
    ];
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('findAll', function () {
    it('calls findAll on Order model', async function () {
      const fake = sinon.fake();
      sinon.replace(Order, 'findAll', fake);

      await OrderRepo.findAll();

      assert.ok(fake.calledOnce);
    });

    it('returns the result of calling findAll on Order model', async function () {
      const fake = sinon.fake.returns(orders);
      sinon.replace(Order, 'findAll', fake);

      const result = await OrderRepo.findAll();

      assert.deepEqual(result, orders);
    });

    it('calls findAll with correct include as argument', async function () {
      const fake = sinon.fake();
      sinon.replace(Order, 'findAll', fake);

      await OrderRepo.findAll();

      assert.deepEqual(fake.getCall(0).args[0], {
        include: [{
          model: Product,
        }],
      });
    });
  });

  describe('findByPk', function () {
    it('calls findByPk on Order model', async function () {
      const fake = sinon.fake();
      sinon.replace(Order, 'findByPk', fake);
      const { id } = order;

      await OrderRepo.findByPk(id);

      assert.ok(fake.calledOnce);
    });

    it('calls findByPk with the id as argument', async function () {
      const fake = sinon.fake();
      sinon.replace(Order, 'findByPk', fake);
      const { id } = order;

      await OrderRepo.findByPk(id);

      assert.equal(fake.getCall(0).args[0], id);
    });

    it('calls findByPk with correct include as argument', async function () {
      const fake = sinon.fake();
      sinon.replace(Order, 'findByPk', fake);
      const { id } = order;

      await OrderRepo.findByPk(id);

      assert.deepEqual(fake.getCall(0).args[1], {
        include: [{
          model: Product,
        }],
      });
    });

    it('returns the result of calling findByPk on Order model', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(Order, 'findByPk', fake);
      const { id } = order;

      const result = await OrderRepo.findByPk(id);

      assert.deepEqual(result, order);
    });
  });

  describe('create', function () {
    it('calls create on the Order model', async function () {
      const fake = sinon.fake();
      sinon.replace(Order, 'create', fake);

      await OrderRepo.create(
        order.customerId,
      );

      assert.ok(fake.calledOnce);
    });

    it('calls create with the correct arguments', async function () {
      const fake = sinon.fake();
      sinon.replace(Order, 'create', fake);
      const expectedArgs = {
        customerId: order.customerId,
      };

      await OrderRepo.create(
        order.customerId,
      );

      assert.deepEqual(fake.getCall(0).args[0], expectedArgs);
    });

    it('returns the created order', async function () {
      const fake = sinon.fake.returns(order);
      sinon.replace(Order, 'create', fake);

      const result = await OrderRepo.create(
        order.customerId,
      );

      assert.deepEqual(result, order);
    });
  });

  describe('update', function () {
    const emptyResult = [
      0,
      [],
    ];

    it('returns null if order not found', async function () {
      const fake = sinon.fake.returns(emptyResult);
      sinon.replace(OrderRepo, 'update', fake);

      const result = await OrderRepo.update(
        order.id,
        order.customerId,
      );

      assert.equal(result, emptyResult);
    });

    it('calls update on Order model if order found', async function () {
      const fake = sinon.fake();
      sinon.replace(Order, 'update', fake);

      await OrderRepo.update(
        order.id,
        order.customerId,
      );

      assert.ok(fake.calledOnce);
    });

    it('returns the updated order', async function () {
      const updateResponse = [
        1,
        [order],
      ];
      const fakeFindByPk = sinon.fake.returns(updateResponse);
      sinon.replace(OrderRepo, 'findByPk', fakeFindByPk);

      const fakeUpdate = sinon.fake.returns(updateResponse);
      sinon.replace(Order, 'update', fakeUpdate);

      const result = await OrderRepo.update(
        order.id,
        order.customerId,
      );

      assert.deepEqual(result, order);
    });
  });

  describe('delete', function () {
    it('calls destroy on the Order model', async function () {
      const fake = sinon.fake();
      sinon.replace(Order, 'destroy', fake);
      const { id } = order;

      await OrderRepo.delete(id);

      assert.ok(fake.calledOnce);
    });

    it('returns the result of the destory method call', async function () {
      const fake = sinon.fake.returns(1);
      sinon.replace(Order, 'destroy', fake);
      const { id } = order;

      const result = await OrderRepo.delete(id);

      assert.equal(result, 1);
    });
  });
});
