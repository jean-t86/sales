/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const sinon = require('sinon');
const { assert } = require('chai');
const { Product } = require('../../sequelize/models');
const ProductRepo = require('../../repos/product-repo.js');

describe('ProductRepo', function () {
  const product = {
    id: 1,
    name: 'iPhone 12 Pro',
    stock: 12,
  };

  const products = [
    product,
  ];

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

    it('returns the result of calling findAll on Product model', async function () {
      const fake = sinon.fake.returns(products);
      sinon.replace(Product, 'findByPk', fake);
      const id = 1;

      const result = await ProductRepo.findByPk(id);

      assert.deepEqual(result, products);
    });
  });

  describe('findByPk', function () {
    it('calls findByPk on Product model', async function () {
      const fake = sinon.fake();
      sinon.replace(Product, 'findByPk', fake);
      const id = 1;

      await ProductRepo.findByPk(id);

      assert.ok(fake.calledOnce);
    });

    it('calls findByPk with the id as argument', async function () {
      const fake = sinon.fake();
      sinon.replace(Product, 'findByPk', fake);
      const id = 1;

      await ProductRepo.findByPk(id);

      assert.equal(fake.getCall(0).args[0], id);
    });

    it('returns the result of calling findByPk on Product model', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(Product, 'findByPk', fake);
      const id = 1;

      const result = await ProductRepo.findByPk(id);

      assert.deepEqual(result, product);
    });
  });
});
