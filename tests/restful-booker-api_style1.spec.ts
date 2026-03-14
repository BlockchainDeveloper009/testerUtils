import { test, expect, request, APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://restful-booker.herokuapp.com';

// Helper to create an auth token
async function createAuthToken(request: APIRequestContext) {
  const response = await request.post(`${BASE_URL}/auth`, {
    data: {
      username: 'admin',
      password: 'password123',
    },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.token).toBeTruthy();
  return body.token;
}

test.describe('restful-booker API @api_withoutlib ', () => {
  test('HealthCheck - Ping', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/ping`);
    expect(response.status()).toBe(201);
    expect(await response.text()).toContain('Created');
  });

  test('Auth - CreateToken', async ({ request }) => {
    const token = await createAuthToken(request);
    expect(typeof token).toBe('string');
  });

  test('Booking - GetBookingIds', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/booking`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    if (body.length > 0) {
      expect(body[0]).toHaveProperty('bookingid');
    }
  });

  test('Booking - CreateBooking', async ({ request }) => {
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
    const response = await request.post(`${BASE_URL}/booking`, {
      data: bookingData,
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(body.booking.firstname).toBe(bookingData.firstname);
  });

  // Add more tests for GetBooking, UpdateBooking, PartialUpdateBooking, DeleteBooking as needed
});
