const createTestApp = require(`${process.cwd()}/test/createTestApp.js`);
const getWeather = require('../../helpers/getWeather');

jest.mock('../../helpers/getWeather');

describe('GET /weather', () => {
  let app;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return weather data for a valid city', async () => {
    getWeather.mockResolvedValue({ temperature: 25, condition: 'Sunny' });

    const response = await app.get('/api/weather?city=London');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ temperature: 25, condition: 'Sunny' });
  });

  it('should return 400 when city is not provided', async () => {
    const response = await app.get('/api/weather');

    expect(response.status).toBe(400);
  });

  it('should return 404 when city is not found', async () => {
    getWeather.mockRejectedValue({ status: 400 });

    const response = await app.get('/api/weather?city=InvalidCity');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('City not found');
  });
});
