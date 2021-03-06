/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const sinon = require('sinon');
const { assert } = require('chai');
const faker = require('faker');
const { Product } = require('../../../sequelize/models');
const ProductRepo = require('../../../repos/product-repo.js');

describe('ProductRepo', function () {
  let product;
  let products;

  beforeEach(function () {
    product = {
      id: faker.random.number(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      stock: faker.random.number(),
    };

    products = [
      product,
    ];
  });

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
      sinon.replace(Product, 'findAll', fake);

      const result = await ProductRepo.findAll();

      assert.deepEqual(result, products);
    });
  });

  describe('findByPk', function () {
    it('calls findByPk on Product model', async function () {
      const fake = sinon.fake();
      sinon.replace(Product, 'findByPk', fake);
      const { id } = product;

      await ProductRepo.findByPk(id);

      assert.ok(fake.calledOnce);
    });

    it('calls findByPk with the id as argument', async function () {
      const fake = sinon.fake();
      sinon.replace(Product, 'findByPk', fake);
      const { id } = product;

      await ProductRepo.findByPk(id);

      assert.equal(fake.getCall(0).args[0], id);
    });

    it('returns the result of calling findByPk on Product model', async function () {
      const fake = sinon.fake.returns(product);
      sinon.replace(Product, 'findByPk', fake);
      const { id } = product;

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
    const emptyResult = [
      0,
      [],
    ];

    it('returns null if product not found', async function () {
      const fake = sinon.fake.returns(emptyResult);
      sinon.replace(ProductRepo, 'update', fake);

      const result = await ProductRepo.update(
        product.id,
        product.name,
        product.description,
        product.stock,
      );

      assert.equal(result, emptyResult);
    });

    it('calls update on Product model if product found', async function () {
      const fake = sinon.fake();
      sinon.replace(Product, 'update', fake);

      await ProductRepo.update(
        product.id,
        product.name,
        product.description,
        product.stock,
      );

      assert.ok(fake.calledOnce);
    });

    it('returns the updated product', async function () {
      const updateResponse = [
        1,
        [product],
      ];
      const fakeFindByPk = sinon.fake.returns(updateResponse);
      sinon.replace(ProductRepo, 'findByPk', fakeFindByPk);

      const fakeUpdate = sinon.fake.returns(updateResponse);
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

  describe('delete', function () {
    it('calls destroy on the Product model', async function () {
      const fake = sinon.fake();
      sinon.replace(Product, 'destroy', fake);
      const { id } = product;

      await ProductRepo.delete(id);

      assert.ok(fake.calledOnce);
    });

    it('returns the result of the destory method call', async function () {
      const fake = sinon.fake.returns(1);
      sinon.replace(Product, 'destroy', fake);
      const { id } = product;

      const result = await ProductRepo.delete(id);

      assert.equal(result, 1);
    });
  });
});
