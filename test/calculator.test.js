const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Calculator API (SIT725 6.2D)', function () {
  // Health check for static root (200 OK)
  it('GET / should return 200', async function () {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
  });

  // --- /add (GET) ---
  it('GET /add returns correct sum for integers', async function () {
    const res = await request(app).get('/add?num1=10&num2=5');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('result', 15);
  });

  it('GET /add handles negative numbers', async function () {
    const res = await request(app).get('/add?num1=-4&num2=10');
    expect(res.status).to.equal(200);
    expect(res.body.result).to.equal(6);
  });

  it('GET /add handles floating point numbers', async function () {
    const res = await request(app).get('/add?num1=2.5&num2=3.1');
    expect(res.status).to.equal(200);
    // Allow string->float behaviour; match actual result text or round if needed
    expect(res.body.result).to.be.closeTo(5.6, 0.000001);
  });

  it('GET /add returns 400 for invalid input', async function () {
    const res = await request(app).get('/add?num1=hello&num2=2');
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error').that.matches(/invalid/i);
  });

  // --- /add (POST) ---
  it('POST /add returns correct sum from JSON body', async function () {
    const res = await request(app)
      .post('/add')
      .send({ num1: 7, num2: 8 })
      .set('Content-Type', 'application/json');
    expect(res.status).to.equal(200);
    expect(res.body.result).to.equal(15);
  });

  it('POST /add returns 400 for invalid JSON input', async function () {
    const res = await request(app)
      .post('/add')
      .send({ num1: 'foo', num2: 2 })
      .set('Content-Type', 'application/json');
    expect(res.status).to.equal(400);
    expect(res.body.error).to.match(/invalid/i);
  });

  // --- /divide (GET) ---
  it('GET /divide returns 400 for division by zero', async function () {
    const res = await request(app).get('/divide?num1=10&num2=0');
    expect(res.status).to.equal(400);
    expect(res.body.error).to.match(/division by zero/i);
  });
});
