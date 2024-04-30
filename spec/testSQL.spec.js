const request = require('supertest');
const { makeServer } = require('../httpScan.js');
const supertest = require('supertest');
const sqlServer = require('../autoAPIs.js');
const fs = require('fs');
//const filePath = 'test1.txt';
//const fileContent = fs.readFileSync(filePath, 'utf-8');
//const linestream = fileContent.split('\n');
//lines = linestream;
test1=fs.readFileSync('./tests/test1.txt').toString();
test2=fs.readFileSync('./tests/test2.txt').toString();
test3=fs.readFileSync('./tests/test3.txt').toString();
test4=fs.readFileSync('./tests/test4.txt').toString();
test5=fs.readFileSync('./tests/test5.txt').toString();
test6=fs.readFileSync('./tests/test6.txt').toString();
test7=fs.readFileSync('./tests/test7.txt').toString();
test8=fs.readFileSync('./tests/test8.txt').toString();
test9=fs.readFileSync('./tests/test9.txt').toString();
test10=fs.readFileSync('./tests/test10.txt').toString();

describe('API Tests', function() {
  it('test 1 - add to cart - valid', async () => {
    const res = (await request(sqlServer).post('/cart/add').send(test1).set('Content-Type','application/json'));
    expect(res.status).toBe(201);
  });
  it('test 2 - add to cart - invalid product ID', async () => {
    const res = (await request(sqlServer).post('/cart/add').send(test2).set('Content-Type','application/json'));
    expect(res.status).toBe(400);
  });
  it('test 3 - add to cart - invalid cart', async () => {
    const res = (await request(sqlServer).post('/cart/add').send(test3).set('Content-Type','application/json'));
    expect(res.status).toBe(400);
  });
  it('test 4 - add to cart - invalid HTTP', async () => {
    const res = (await request(sqlServer).post('/cart/ad').send(test4).set('Content-Type','application/json'));
    expect(res.status).toBe(404);
  });
  it('test 5 - add to cart - valid (2)', async () => {
    const res = (await request(sqlServer).post('/cart/add').send(test5).set('Content-Type','application/json'));
    expect(res.status).toBe(201);
  });
  it('test 6 - update cart', async () => {
    const res = (await request(sqlServer).post('/cart/update').send(test6).set('Content-Type','application/json'));
    expect(res.status).toBe(201);
  });
  it('test 7 - clear cart', async () => {
    const res = (await request(sqlServer).post('/cart/clear').send(test7).set('Content-Type','application/json'));
    expect(res.status).toBe(201);
  });
  it('test 8 - place order', async () => {
    const res = (await request(sqlServer).post('/order/add').send(test8).set('Content-Type','application/json'));
    expect(res.status).toBe(201);
  });
  it('test 9 - place order (invalid)', async () => {
    const res = (await request(sqlServer).post('/order/add').send(test9).set('Content-Type','application/json'));
    expect(res.status).toBe(400);
  });
  it('test 10 - place order bad URI', async () => {
    const res = (await request(sqlServer).post('/orde/add').send(test10).set('Content-Type','application/json'));
    expect(res.status).toBe(404);
  });

 
  
  })
   