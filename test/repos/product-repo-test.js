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
    description: 'The newest iPhone',
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

  describe('create', function () {
    it('calls create on the Product model', async function () {
      const fake = sinon.fake();
      sinon.replace(Product, 'create', fake);

      await ProductRepo.create(
        product.name,
        product.description,
        product.stock,
      );

      assert.ok(fake.calledOnce);
    });

    it('calls create with the correct arguments', async function () {
      const fake = sinon.fake();
      sinon.replace(Product, 'create', fake);
      const expectedArgs = {
        name: product.name,
        description: product.description,
        stock: product.stock,
      };

      await ProductRepo.create(
        product.name,
        product.description,
        product.stock,
      );

      assert.deepEqual(fake.getCall(0).args[0], expectedArgs);
    });

    it('returns the created product', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(Product, 'create', fake);

      const result = await ProductRepo.create(
        product.name,
        product.description,
        product.stock,
      );

      assert.deepEqual(result, product);
    });
  });

  describe('update', function () {
    it('calls findByPk on ProductRepo', async function () {
      const fake = sinon.fake();
      sinon.replace(ProductRepo, 'findByPk', fake);

      await ProductRepo.update(
        product.id,
        product.name,
        product.description,
        product.stock,
      );

      assert.ok(fake.calledOnce);
    });

    it('returns null if product not found', async function () {
      const fake = sinon.fake();
      sinon.replace(ProductRepo, 'findByPk', fake);

      const result = await ProductRepo.update(
        product.id,
        product.name,
        product.description,
        product.stock,
      );

      assert.equal(result, null);
    });

    it('calls update on Product model if product found', async function () {
      const fakeFindByPk = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'findByPk', fakeFindByPk);

      const fakeUpdate = sinon.fake();
      sinon.replace(Product, 'update', fakeUpdate);

      await ProductRepo.update(
        product.id,
        product.name,
        product.description,
        product.stock,
      );

      assert.ok(fakeUpdate.calledOnce);
    });

    it('returns the updated product', async function () {
      const fakeFindByPk = sinon.fake.returns(product);
      sinon.replace(ProductRepo, 'findByPk', fakeFindByPk);

      const fakeUpdate = sinon.fake.returns(product);
      sinon.replace(Product, 'update', fakeUpdate);

      const result = await ProductRepo.update(
        product.id,
        product.name,
        product.description,
        product.stock,
      );

      assert.deepEqual(result, product);
    });
  });
});
