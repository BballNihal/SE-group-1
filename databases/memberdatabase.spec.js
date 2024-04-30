const request = require('supertest');
const app = require('./database'); 

describe('Test /member endpoint', () => {
  it('adds a member', async () => {
    const res = await request(app)
      .post('/member')
      .send({
        username: 'test@gmail.com',
        password: 'password123',
        phoneNumber: '1234567890',
        adminStatus: 0
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Member registered successfully. Your member ID is');
  });

  it('updates a member', async () => {
    const res = await request(app)
      .put('/member')
      .send({
        memberID: 'M0000000001', 
        username: 'test_updated@gmail.com',
        password: 'password1234',
        phoneNumber: '0987654321',
        adminStatus: 1
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe(`Member updated successfully. Your member ID is M0000000001`);
  });

  it('deletes a member', async () => {
    const res = await request(app)
      .delete('/member')
      .send({
        memberID: 'M0000000001' 
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe(`Member deleted successfully. Your member ID was M0000000001`);
  });
});

describe('Test /member endpoint', () => {
    it('fails to add a member due to invalid email', async () => {
      const res = await request(app)
        .post('/member')
        .send({
          username: 'invalid_email',
          password: 'password123',
          phoneNumber: '1234567890',
          adminStatus: 0
        });
      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe('Username must be a valid email');
    });
  
    it('fails to update a member due to invalid phone number', async () => {
      const res = await request(app)
        .put('/member')
        .send({
          memberID: 'M0000000001', 
          username: 'test_updated@gmail.com',
          password: 'password1234',
          phoneNumber: 'invalid_phone_number',
          adminStatus: 1
        });
      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe('Phone number must be a valid number with 10 to 15 digits');
    });
  
  });
  describe('Test /member endpoint', () => {
    it('fails to add a member due to missing username', async () => {
      const res = await request(app)
        .post('/member')
        .send({
          password: 'password123',
          phoneNumber: '1234567890',
          adminStatus: 0
        });
      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe('Missing required property: username');
    });
  
    it('fails to update a member due to missing password', async () => {
      const res = await request(app)
        .put('/member')
        .send({
          memberID: 'M0000000001', 
          username: 'test_updated@gmail.com',
          phoneNumber: '0987654321',
          adminStatus: 1
        });
      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe('Missing required property: password');
    });
  
    it('fails to delete a member due to missing memberID', async () => {
      const res = await request(app)
        .delete('/member')
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe('Missing required property: memberID');
    });
  });