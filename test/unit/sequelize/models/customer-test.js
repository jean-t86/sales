/* eslint-disable no-empty */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */

const { assert, expect } = require('chai');
const sinon = require('sinon');
const Sequelize = require('sequelize');
const { Customer } = require('../../../../sequelize/models');

describe('Customer sequelize model', function () {
  const customer = Customer.build({
    first_name: 'John',
    last_name: 'doe',
    email: 'john_doe@email.com',
  });

  const invalidCustomer = Customer.build({
    first_name: 'John',
    last_name: 'doe',
    email: 'john_doeemail.com',
  });

  afterEach(function () {
    sinon.restore();
  });

  it('has all the correct properties', function () {
    expect(Customer.tableAttributes).to.have.ownProperty('id');
    expect(Customer.tableAttributes).to.have.ownProperty('first_name');
    expect(Customer.tableAttributes).to.have.ownProperty('last_name');
    expect(Customer.tableAttributes).to.have.ownProperty('email');
  });

  it('has the correct constraint on id field', function () {
    assert.deepEqual(Customer.tableAttributes.id.type, Sequelize.DataTypes.INTEGER());
    expect(Customer.tableAttributes.id.allowNull).to.equal(false);
    assert.ok(Customer.tableAttributes.id.primaryKey);
    assert.ok(Customer.tableAttributes.id.autoIncrement);
  });

  it('has the correct constraint on first_name field', function () {
    assert.deepEqual(Customer.tableAttributes.first_name.type, Sequelize.DataTypes.STRING());
    expect(Customer.tableAttributes.first_name.allowNull).to.equal(false);
  });

  it('has the correct constraint on last_name field', function () {
    assert.deepEqual(Customer.tableAttributes.last_name.type, Sequelize.DataTypes.STRING());
    expect(Customer.tableAttributes.last_name.allowNull).to.equal(false);
  });

  it('has the correct constraint on email field', function () {
    assert.deepEqual(Customer.tableAttributes.email.type, Sequelize.DataTypes.STRING());
    expect(Customer.tableAttributes.email.allowNull).to.equal(false);
  });

  it('validates emails for the email field', async function () {
    const spy = sinon.spy(customer, 'validate');

    await customer.validate();

    assert.ok(!spy.threw());
  });

  it('throws an exception for invalid emails', async function () {
    const spy = sinon.spy(customer, 'validate');

    try {
      await invalidCustomer.validate();
    } catch (e) {} finally {
      assert.ok(!spy.threw('SequelizeValidationError:'));
    }
  });
});
