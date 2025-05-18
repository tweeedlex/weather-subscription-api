# Weather subscription app

A Node.js / Express backend application with simple frontend.

- Uses MongoDB to store subscription and user data.
- Sends emails via Nodemailer for subscription confirmations.
- Includes tests written with Jest and Supertest for API.
- Supports containerized deployment and local development using Docker Compose.

---

## Installation and Setup

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values.
You can get `WEATHER_API_KEY` from [WeatherAPI](https://www.weatherapi.com/), `EMAIL_USER` and `EMAIL_PASSWORD` from
your email provider. For Gmail users, you may need to set up an App Password if you have 2-Step Verification enabled.

```
PORT=5005
NODE_DOCKER_PORT=5005
WEATHER_API_KEY=exampleapikey
EMAIL_USER=example@gmail.com
EMAIL_PASSWORD=examplepassword
MONGODB_URL=mongodb://root:root@mongodb:27017/weather?authSource=admin
MONGODB_USER=root
MONGODB_PASSWORD=root
MONGODB_DATABASE=weather
MONGODB_LOCAL_PORT=27017
MONGODB_DOCKER_PORT=27017
```

### Running Locally (Without Docker)

1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   npm start
   ```
3. The API will be available at `http://localhost:5005` (or your configured port).

### Running Locally (With Docker)

1. Build and start the containers:
   ```
   docker-compose up --build -d --force-recreate
   ```

2. The API will be available at `http://localhost:5005` (or your configured port).

### Running Tests

Run all tests using:

```
npm run test
```

---

## User flow

1. `POST /api/subscribe`
   - User submits a subscription form with their email and location.
   - The server validates the input and checks if the email is already subscribed.
   - If valid, the server sends a confirmation email to the user.
2. `GET /api/confirm/:token`
   - User submits the confirmation form with the token received in the email.
   - The server verifies the token and activates the subscription. 
   - After activation, the server will send weather updates to the user via email during scheduled broadcast.
3. `GET /api/unsubscribe/:token`
   - User submits the unsubscribe form with the token received in the email.
   - The server verifies the token and removes the subscription.
