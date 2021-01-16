/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */

const { assert, expect } = require('chai');
const Sequelize = require('sequelize');
const { Product } = require('../../../sequelize/models');

describe('Product sequelize model', function () {
  it('has all the correct properties', function () {
    expect(Product.tableAttributes).to.have.ownProperty('id');
    expect(Product.tableAttributes).to.have.ownProperty('name');
    expect(Product.tableAttributes).to.have.ownProperty('description');
    expect(Product.tableAttributes).to.have.ownProperty('stock');
  });

  it('has the correct constraint on id field', function () {
    assert.deepEqual(Product.tableAttributes.id.type, Sequelize.DataTypes.INTEGER());
    expect(Product.tableAttributes.id.allowNull).to.equal(false);
    assert.ok(Product.tableAttributes.id.primaryKey);
    assert.ok(Product.tableAttributes.id.autoIncrement);
  });

  it('has the correct constraint on name field', function () {
    assert.deepEqual(Product.tableAttributes.name.type, Sequelize.DataTypes.STRING());
    expect(Product.tableAttributes.name.allowNull).to.equal(false);
  });

  it('has the correct constraint on description field', function () {
    assert.deepEqual(Product.tableAttributes.description.type, Sequelize.DataTypes.STRING());
    expect(typeof Product.tableAttributes.description.allowNull).to.equal('undefined');
  });

  it('has the correct constraint on stock field', function () {
    assert.deepEqual(Product.tableAttributes.stock.type, Sequelize.DataTypes.INTEGER());
    expect(Product.tableAttributes.stock.allowNull).to.equal(false);
  });
});
