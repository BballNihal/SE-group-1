const request = require('supertest');
const { makeServer } = require('../httpScan.js');
const supertest = require('supertest');
<<<<<<< HEAD
const sqlServer = require('../autoAPIs.js');
=======
const sqlServer = require('../calSQL.js');
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
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
test11=fs.readFileSync('./tests/test11.txt').toString();
test12=fs.readFileSync('./tests/test12.txt').toString();
test13=fs.readFileSync('./tests/test13.txt').toString();

<<<<<<< HEAD
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


=======
describe('HW5 Tests', function() {
  
 it('test 1 - add item ', async () => {
  const res = (await request(sqlServer).post('/add').send(test1).set('Content-Type','application/json'));
  expect(res.status).toBe(201);
});
it('test 2 - add another item ', async () => {
  const res = (await request(sqlServer).post('/add').send(test2).set('Content-Type','application/json'));
  expect(res.status).toBe(201);
});
it('test 3 - add item with invalid status', async () => {
  const res = (await request(sqlServer).post('/add').send(test3).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});
it('test 4 - add item with invalid date', async () => {
  const res = (await request(sqlServer).post('/add').send(test4).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});
it('test 5 - add item with invalid method', async () => {
  const res = (await request(sqlServer).post('/add').send(test5).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});
it('test 6 - cancel item', async () => {
  const res = (await request(sqlServer).post('/cancel').send(test6).set('Content-Type','application/json'));
  expect(res.status).toBe(201);
});
it('test 7 - bad cancellation', async () => {
  const res = (await request(sqlServer).post('/cancel').send(test7).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});
it('test 8 - get 3 next dates', async () => {
  const res = (await request(sqlServer).get('/nextdates').send(test8).set('Content-Type','application/json'));
  expect(res.status).toBe(200);
});
it('test 9 - get 2 next dates', async () => {
  const res = (await request(sqlServer).get('/nextdates').send(test9).set('Content-Type','application/json'));
  expect(res.status).toBe(200);
});
it('test 10 - get 10 next dates (error)', async () => {
  const res = (await request(sqlServer).get('/nextdates').send(test10).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});
it('test 11 - get next dates (bad date format)', async () => {
  const res = (await request(sqlServer).get('/nextdates').send(test11).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});
it('test 12 - lookup 1', async () => {
  const res = (await request(sqlServer).get('/list').send(test12).set('Content-Type','application/json'));
  expect(res.status).toBe(200);
});
it('test 13 - lookup (bad request)', async () => {
  const res = (await request(sqlServer).get('/list').send(test13).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});

it('test 14 - post/get switch', async () => {
  const res = (await request(sqlServer).post('/nextdates').send(test11).set('Content-Type','application/json'));
  expect(res.status).toBe(404);
});
it('test 15 - nonexistent request', async () => {
  const res = (await request(sqlServer).post('/unknown').send(test11).set('Content-Type','application/json'));
  expect(res.status).toBe(404);
});
/*
it('test 5 - add item with invalid method', async () => {
  const res = (await request(sqlServer).post('/nextdates').send(test5).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});
it('test 5 - add item with invalid method', async () => {
  const res = (await request(sqlServer).post('/add').send(test5).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});
it('test 5 - add item with invalid method', async () => {
  const res = (await request(sqlServer).post('/add').send(test5).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});
it('test 5 - add item with invalid method', async () => {
  const res = (await request(sqlServer).post('/add').send(test5).set('Content-Type','application/json'));
  expect(res.status).toBe(400);
});*/
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
 
  
  })
   