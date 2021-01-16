/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const sinon = require('sinon');
const { assert } = require('chai');
const { Product } = require('../../sequelize/models');
const ProductRepo = require('../../repos/product-repo.js');

describe('ProductRepo', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('findAll', function () {
    it('calls findAll on Product model', async function () {
      const fake = sinon.fake();
      sinon.replace(Product, 'findAll', fake);

      await ProductRepo.findAll();

      assert.ok(fake.calledOnce);
    });
  });
});
