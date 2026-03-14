import { test, expect } from '@playwright/test';
import ApiHelper from '../src/lib/apiHelper';
//https://restful-booker.herokuapp.com/apidoc/index.html
//https://ultimateqa.com/dummy-automation-websites/#1_SauceDemo_E-Commerce
//https://ultimateqa.com/dummy-automation-websites/
//https://docs.langchain.com/langsmith/manage-datasets-in-application

const BASE_URL = 'https://restful-booker.herokuapp.com';
const api = new ApiHelper(BASE_URL);

// Helper to create an auth token
async function createAuthToken(api: ApiHelper) {
  const response = await api.post('/auth', {
    username: 'admin',
    password: 'password123',
  });
  expect(response.status).toBe(200);
  expect(response.data.token).toBeTruthy();
  return response.data.token;
}

test.describe('restful-booker API @api_withlib_axios', () => {
  test('HealthCheck - Ping', async () => {
    const response = await api.get('/ping');
    expect(response.status).toBe(201);
    expect(response.data).toContain('Created');
  });

  test('Auth - CreateToken', async () => {
    const token = await createAuthToken(api);
    expect(typeof token).toBe('string');
  });

  test('Booking - GetBookingIds', async () => {
    const response = await api.get('/booking');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBeTruthy();
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('bookingid');
    }
  });

  test('Booking - CreateBooking', async () => {
    const bookingData = {
      firstname: 'Jim',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '2019-01-01',
      },
      additionalneeds: 'Breakfast',
    };
    const response = await api.post('/booking', bookingData);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('bookingid');
    expect(response.data.booking.firstname).toBe(bookingData.firstname);
  });

  // Add more tests for GetBooking, UpdateBooking, PartialUpdateBooking, DeleteBooking as needed
});
