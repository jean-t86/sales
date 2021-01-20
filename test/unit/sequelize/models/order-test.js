/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */

const { assert, expect } = require('chai');
const Sequelize = require('sequelize');
const { Order } = require('../../../../sequelize/models');

describe('Order sequelize model', function () {
  it('has all the correct properties', function () {
    expect(Order.tableAttributes).to.have.ownProperty('customerId');
  });

  it('has the correct constraint on id field', function () {
    assert.deepEqual(Order.tableAttributes.id.type, Sequelize.DataTypes.INTEGER());
    expect(Order.tableAttributes.id.allowNull).to.equal(false);
    assert.ok(Order.tableAttributes.id.primaryKey);
    assert.ok(Order.tableAttributes.id.autoIncrement);
  });

  it('has the correct constraints on customerId field', function () {
    assert.deepEqual(Order.tableAttributes.customerId.type, Sequelize.DataTypes.INTEGER());
    expect(Order.tableAttributes.customerId.allowNull).to.equal(false);
  });

  it('has the correct association with Customer', function () {
    expect(Order.associations).to.have.ownProperty('Customer');
    expect(Order.associations.Customer.associationAccessor).to.equal('Customer');
    expect(Order.associations.Customer.associationType).to.equal('BelongsTo');
    expect(Order.associations.Customer.foreignKey).to.equal('customerId');
  });
});
