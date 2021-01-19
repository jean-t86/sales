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
});
