/* eslint-disable no-empty */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */

const { assert, expect } = require('chai');
const sinon = require('sinon');
const faker = require('faker');
const Sequelize = require('sequelize');
const { Customer } = require('../../../../sequelize/models');

describe('Customer sequelize model', function () {
  const customer = Customer.build({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  });

  const invalidCustomer = Customer.build({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.lorem.word(),
  });

  afterEach(function () {
    sinon.restore();
  });

  it('has all the correct properties', function () {
    expect(Customer.tableAttributes).to.have.ownProperty('id');
    expect(Customer.tableAttributes).to.have.ownProperty('firstName');
    expect(Customer.tableAttributes).to.have.ownProperty('lastName');
    expect(Customer.tableAttributes).to.have.ownProperty('email');
  });

  it('has the correct constraint on id field', function () {
    assert.deepEqual(Customer.tableAttributes.id.type, Sequelize.DataTypes.INTEGER());
    expect(Customer.tableAttributes.id.allowNull).to.equal(false);
    assert.ok(Customer.tableAttributes.id.primaryKey);
    assert.ok(Customer.tableAttributes.id.autoIncrement);
  });

  it('has the correct constraint on firstName field', function () {
    assert.deepEqual(Customer.tableAttributes.firstName.type, Sequelize.DataTypes.STRING());
    expect(Customer.tableAttributes.firstName.allowNull).to.equal(false);
  });

  it('has the correct constraint on lastName field', function () {
    assert.deepEqual(Customer.tableAttributes.lastName.type, Sequelize.DataTypes.STRING());
    expect(Customer.tableAttributes.lastName.allowNull).to.equal(false);
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

  it('has the correct association with Order', function () {
    expect(Customer.associations).to.have.ownProperty('Orders');
    expect(Customer.associations.Orders.associationAccessor).to.equal('Orders');
    expect(Customer.associations.Orders.associationType).to.equal('HasMany');
    expect(Customer.associations.Orders.foreignKey).to.equal('customerId');
  });
});
