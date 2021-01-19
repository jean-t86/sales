/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const sinon = require('sinon');
const { assert } = require('chai');
const faker = require('faker');
const { Customer } = require('../../../sequelize/models');
const CustomerRepo = require('../../../repos/customer-repo.js');

describe('CustomerRepo', function () {
  let customer;
  let customers;

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

  afterEach(function () {
    sinon.restore();
  });

  describe('findAll', function () {
    it('calls findAll on Customer model', async function () {
      const fake = sinon.fake();
      sinon.replace(Customer, 'findAll', fake);

      await CustomerRepo.findAll();

      assert.ok(fake.calledOnce);
    });

    it('returns the result of calling findAll on Customer model', async function () {
      const fake = sinon.fake.returns(customers);
      sinon.replace(Customer, 'findAll', fake);

      const result = await CustomerRepo.findAll();

      assert.deepEqual(result, customers);
    });
  });

  describe('findByPk', function () {
    it('calls findByPk on Customer model', async function () {
      const fake = sinon.fake();
      sinon.replace(Customer, 'findByPk', fake);
      const id = 1;

      await CustomerRepo.findByPk(id);

      assert.ok(fake.calledOnce);
    });

    it('calls findByPk with the id as argument', async function () {
      const fake = sinon.fake();
      sinon.replace(Customer, 'findByPk', fake);
      const id = 1;

      await CustomerRepo.findByPk(id);

      assert.equal(fake.getCall(0).args[0], id);
    });

    it('returns the result of calling findByPk on Customer model', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(Customer, 'findByPk', fake);
      const id = 1;

      const result = await CustomerRepo.findByPk(id);

      assert.deepEqual(result, customer);
    });
  });

  describe('create', function () {
    it('calls create on the Customer model', async function () {
      const fake = sinon.fake();
      sinon.replace(Customer, 'create', fake);

      await CustomerRepo.create(
        customer.firstName,
        customer.lastName,
        customer.email,
      );

      assert.ok(fake.calledOnce);
    });

    it('calls create with the correct arguments', async function () {
      const fake = sinon.fake();
      sinon.replace(Customer, 'create', fake);
      const expectedArgs = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      };

      await CustomerRepo.create(
        customer.firstName,
        customer.lastName,
        customer.email,
      );

      assert.deepEqual(fake.getCall(0).args[0], expectedArgs);
    });

    it('returns the created customer', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(Customer, 'create', fake);

      const result = await CustomerRepo.create(
        customer.firstName,
        customer.lastName,
        customer.email,
      );

      assert.deepEqual(result, customer);
    });
  });
});
