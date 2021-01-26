/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { before } = require('mocha');
const { assert } = require('chai');
const sinon = require('sinon');
const faker = require('faker');
const request = require('supertest');
const server = require('../../server.js');
const CustomerRepo = require('../../../repos/customer-repo.js');

describe('Customer controller', function () {
  let customer;
  let customers;

  before(function (done) {
    if (server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  beforeEach(function () {
    customer = {
      id: faker.random.number(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    };

    customers = [
      customer,
    ];
  });

  beforeEach(function () {
    server.listen(3000);
  });

  afterEach(function (done) {
    sinon.restore();
    server.close(done);
  });

  describe('findAll', function () {
    it('calls findAll on CustomerRepo', async function () {
      const fake = sinon.fake();
      sinon.replace(CustomerRepo, 'findAll', fake);

      await request(server)
        .get('/customers');

      assert.ok(fake.calledOnce);
    });

    it('returns 404 if customers are not found', async function () {
      const fake = sinon.fake();
      sinon.replace(CustomerRepo, 'findAll', fake);

      await request(server)
        .get('/customers')
        .expect(404);
    });

    it('returns 200 if customers found', async function () {
      const fake = sinon.fake.returns(customers);
      sinon.replace(CustomerRepo, 'findAll', fake);

      await request(server)
        .get('/customers')
        .expect(200);
    });

    it('returns the array of customers', async function () {
      const fake = sinon.fake.returns(customers);
      sinon.replace(CustomerRepo, 'findAll', fake);

      const response = await request(server)
        .get('/customers')
        .expect(200);

      assert.ok(response);
      assert.deepEqual(response.body, customers);
    });
  });

  describe('create', function () {
    it('calls create on CustomerRepo', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'create', fake);

      await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201);

      assert.ok(fake.calledOnce);
    });

    it('calls create with the correct arguments', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'create', fake);

      await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201);

      assert.deepEqual(fake.getCall(0).args[0], customer.firstName);
      assert.deepEqual(fake.getCall(0).args[1], customer.lastName);
      assert.deepEqual(fake.getCall(0).args[2], customer.email);
    });

    it('returns 400 if firstName is undefined', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'create', fake);

      await request(server)
        .post('/customers')
        .send({
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(400);
    });

    it('returns 400 if lastName is undefined', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'create', fake);

      await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          email: customer.email,
        })
        .expect(400);
    });

    it('returns 400 if email is undefined', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'create', fake);

      await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
        })
        .expect(400);
    });

    it('returns 400 if email is invalid', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'create', fake);

      await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: faker.lorem.word,
        })
        .expect(400);
    });

    it('returns the created customer', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'create', fake);

      await request(server)
        .post('/customers')
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(201)
        .then((res) => {
          const createdCustomer = res.body;
          assert.deepEqual(createdCustomer, customer);
        });
    });
  });

  describe('findByPk', function () {
    it('returns 400 if id is not a number', async function () {
      const fake = sinon.fake();
      sinon.replace(CustomerRepo, 'findByPk', fake);
      const id = 'dsf';

      await request(server)
        .get(`/customers/${id}`)
        .expect(400);
    });

    it('returns 404 is findByPk returns null', async function () {
      const fake = sinon.fake.returns(null);
      sinon.replace(CustomerRepo, 'findByPk', fake);
      const { id } = customer;

      await request(server)
        .get(`/customers/${id}`)
        .expect(404);
    });

    it('calls findByPk on customer repository', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'findByPk', fake);
      const { id } = customer;

      await request(server)
        .get(`/customers/${id}`)
        .expect(200);

      assert.ok(fake.calledOnce);
    });

    it('calls findByPk with the id as argument', async function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'findByPk', fake);
      const { id } = customer;

      await request(server)
        .get(`/customers/${id}`)
        .expect(200);

      assert.equal(fake.getCall(0).args[0], id);
    });

    it('returns a customer if found', function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'findByPk', fake);
      const { id } = customer;

      return request(server)
        .get(`/customers/${id}`)
        .expect(200)
        .then((res) => {
          const fetchedCustomer = res.body;
          assert.deepEqual(fetchedCustomer.id, customer.id);
          assert.deepEqual(fetchedCustomer.firstName, customer.firstName);
          assert.deepEqual(fetchedCustomer.lastName, customer.lastName);
          assert.deepEqual(fetchedCustomer.email, customer.email);
        });
    });
  });

  describe('update', function () {
    it('returns 400 if id is not a number', function () {
      const id = 'dsf';

      return request(server)
        .put(`/customers/${id}`)
        .expect(400);
    });

    it('returns 400 if firstName is missing', function () {
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(400);
    });

    it('returns 400 if lastName is missing', function () {
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          firstName: customer.firstName,
          email: customer.email,
        })
        .expect(400);
    });

    it('returns 400 if email is missing', function () {
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
        })
        .expect(400);
    });

    it('returns 404 if customer cannot be found', function () {
      const fake = sinon.fake.returns(null);
      sinon.replace(CustomerRepo, 'update', fake);
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(404);
    });

    it('returns 200 if update was successful', function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'update', fake);
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(200);
    });

    it('returns the updated customer', function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'update', fake);
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(200)
        .then((res) => {
          assert.deepEqual(res.body, customer);
        });
    });

    it('returns the same id as the passed parameter', function () {
      const fake = sinon.fake.returns(customer);
      sinon.replace(CustomerRepo, 'update', fake);
      const { id } = customer;

      return request(server)
        .put(`/customers/${id}`)
        .send({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        })
        .expect(200)
        .then((res) => {
          assert.equal(res.body.id, id);
        });
    });
  });

  describe('delete', function () {
    it('returns 400 if id is not valid', function () {
      const id = 'wer';

      return request(server)
        .delete(`/customers/${id}`)
        .expect(400);
    });

    it('returns 404 if customer is not found', function () {
      const fake = sinon.fake.returns(0);
      sinon.replace(CustomerRepo, 'delete', fake);
      const { id } = customer;

      return request(server)
        .delete(`/customers/${id}`)
        .expect(404);
    });

    it('calls delete on customer repository', function () {
      const fake = sinon.fake();
      sinon.replace(CustomerRepo, 'delete', fake);
      const { id } = customer;

      return request(server)
        .delete(`/customers/${id}`)
        .expect(404)
        .then(() => {
          assert.ok(fake.calledOnce);
        });
    });

    it('calls delete on repository with id as parameter', function () {
      const fake = sinon.fake();
      sinon.replace(CustomerRepo, 'delete', fake);
      const { id } = customer;

      return request(server)
        .delete(`/customers/${id}`)
        .expect(404)
        .then(() => {
          assert.equal(fake.getCall(0).args[0], id);
        });
    });

    it('returns 204 on successful delete', function () {
      const fake = sinon.fake.returns(1);
      sinon.replace(CustomerRepo, 'delete', fake);
      const { id } = customer;

      return request(server)
        .delete(`/customers/${id}`)
        .expect(404);
    });
  });
});
