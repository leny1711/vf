# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "CLIENT"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT"
  },
  "token": "jwt_token"
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT",
    "isAvailable": false
  },
  "token": "jwt_token"
}
```

### GET /auth/profile
Get current user profile. **Requires authentication.**

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CLIENT",
  "isAvailable": false,
  "latitude": null,
  "longitude": null
}
```

---

## Users Endpoints

### PUT /users/location
Update user location. **Requires authentication.**

**Request Body:**
```json
{
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

### PUT /users/availability
Toggle provider availability. **Requires authentication.**

**Request Body:**
```json
{
  "isAvailable": true
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "isAvailable": true
}
```

### GET /users/stats
Get user statistics. **Requires authentication.**

**Response for Provider:** `200 OK`
```json
{
  "completedMissions": 15,
  "totalEarnings": 450.50,
  "averageRating": 4.5
}
```

**Response for Client:** `200 OK`
```json
{
  "totalMissions": 20,
  "completedMissions": 18
}
```

---

## Missions Endpoints

### POST /missions
Create a new mission. **Requires authentication (CLIENT role).**

**Request Body:**
```json
{
  "title": "Grocery Shopping",
  "description": "Need someone to buy groceries",
  "address": "123 Main Street, Paris",
  "price": 25.00,
  "urgent": false
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "Grocery Shopping",
  "description": "Need someone to buy groceries",
  "address": "123 Main Street, Paris",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "price": 25.00,
  "urgent": false,
  "status": "PENDING",
  "clientId": "uuid",
  "providerId": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /missions/:id
Get mission details. **Requires authentication.**

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "Grocery Shopping",
  "description": "Need someone to buy groceries",
  "address": "123 Main Street, Paris",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "price": 25.00,
  "urgent": false,
  "status": "ACCEPTED",
  "clientId": "uuid",
  "providerId": "uuid",
  "client": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  },
  "provider": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+0987654321"
  },
  "payment": null,
  "rating": null
}
```

### GET /missions/nearby
Get nearby missions for provider. **Requires authentication (PROVIDER role).**

**Query Parameters:**
- `maxDistance` (optional): Maximum distance in kilometers (default: 10)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "title": "Grocery Shopping",
    "description": "Need someone to buy groceries",
    "address": "123 Main Street, Paris",
    "price": 25.00,
    "distance": 2.5,
    "client": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
]
```

### GET /missions/my-missions
Get user's missions. **Requires authentication.**

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "title": "Grocery Shopping",
    "status": "COMPLETED",
    "price": 25.00,
    "provider": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "rating": {
      "score": 5,
      "comment": "Excellent service!"
    }
  }
]
```

### POST /missions/:id/accept
Accept a mission. **Requires authentication (PROVIDER role).**

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "status": "ACCEPTED",
  "providerId": "uuid",
  "acceptedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /missions/:id/status
Update mission status. **Requires authentication.**

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Allowed statuses:** `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "status": "IN_PROGRESS",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /missions/:id/messages
Send a message. **Requires authentication.**

**Request Body:**
```json
{
  "receiverId": "uuid",
  "content": "Hello, I'm on my way!"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "missionId": "uuid",
  "senderId": "uuid",
  "receiverId": "uuid",
  "content": "Hello, I'm on my way!",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "sender": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith"
  }
}
```

### GET /missions/:id/messages
Get mission messages. **Requires authentication.**

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "content": "Hello, I'm on my way!",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "sender": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith"
    }
  }
]
```

---

## Payments Endpoints

### POST /payments/create-intent
Create a payment intent. **Requires authentication.**

**Request Body:**
```json
{
  "missionId": "uuid"
}
```

**Response:** `201 Created`
```json
{
  "payment": {
    "id": "uuid",
    "missionId": "uuid",
    "amount": 25.00,
    "platformFee": 3.75,
    "providerAmount": 21.25,
    "status": "PENDING",
    "stripePaymentIntent": "pi_xxxxx"
  },
  "clientSecret": "pi_xxxxx_secret_xxxxx"
}
```

### POST /payments/confirm
Confirm payment. **Requires authentication.**

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxxxx"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "status": "SUCCEEDED",
  "amount": 25.00
}
```

### GET /payments/mission/:missionId
Get payment by mission ID. **Requires authentication.**

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "missionId": "uuid",
  "amount": 25.00,
  "platformFee": 3.75,
  "providerAmount": 21.25,
  "status": "SUCCEEDED",
  "mission": {
    "id": "uuid",
    "title": "Grocery Shopping"
  }
}
```

### GET /payments/earnings
Get provider earnings. **Requires authentication (PROVIDER role).**

**Response:** `200 OK`
```json
{
  "payments": [
    {
      "id": "uuid",
      "providerAmount": 21.25,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "mission": {
        "id": "uuid",
        "title": "Grocery Shopping"
      }
    }
  ],
  "totalEarnings": 450.50
}
```

---

## Ratings Endpoints

### POST /ratings
Create a rating. **Requires authentication (CLIENT role).**

**Request Body:**
```json
{
  "missionId": "uuid",
  "score": 5,
  "comment": "Excellent service!"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "missionId": "uuid",
  "clientId": "uuid",
  "providerId": "uuid",
  "score": 5,
  "comment": "Excellent service!",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /ratings/provider/:providerId
Get provider ratings. **Requires authentication.**

**Response:** `200 OK`
```json
{
  "ratings": [
    {
      "id": "uuid",
      "score": 5,
      "comment": "Excellent service!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "client": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "averageScore": 4.8,
  "totalRatings": 15
}
```

### GET /ratings/mission/:missionId
Get rating by mission ID. **Requires authentication.**

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "missionId": "uuid",
  "score": 5,
  "comment": "Excellent service!",
  "provider": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith"
  }
}
```

---

## Admin Endpoints

All admin endpoints require ADMIN role.

### GET /admin/dashboard
Get admin dashboard statistics. **Requires authentication (ADMIN role).**

**Response:** `200 OK`
```json
{
  "users": {
    "total": 150,
    "clients": 100,
    "providers": 45,
    "availableProviders": 20
  },
  "missions": {
    "total": 500,
    "pending": 50,
    "active": 30,
    "completed": 400
  },
  "revenue": {
    "total": 12500.00,
    "platform": 1875.00
  }
}
```

### GET /admin/users
Get all users with pagination. **Requires authentication (ADMIN role).**

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CLIENT",
      "isBlocked": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### GET /admin/missions
Get all missions with pagination. **Requires authentication (ADMIN role).**

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Response:** Similar structure to users endpoint

### GET /admin/payments
Get all payments with pagination. **Requires authentication (ADMIN role).**

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Response:** Similar structure to users endpoint

### PUT /admin/users/:userId/block
Block or unblock a user. **Requires authentication (ADMIN role).**

**Request Body:**
```json
{
  "isBlocked": true
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "isBlocked": true
}
```

### DELETE /admin/users/:userId
Delete a user. **Requires authentication (ADMIN role).**

**Response:** `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

or

```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

---

## Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Mission Status Flow

1. `PENDING` - Mission created, waiting for provider
2. `ACCEPTED` - Provider accepted the mission
3. `IN_PROGRESS` - Provider started working on the mission
4. `COMPLETED` - Mission completed successfully
5. `CANCELLED` - Mission cancelled

---

## Payment Status Flow

1. `PENDING` - Payment intent created
2. `SUCCEEDED` - Payment successful
3. `FAILED` - Payment failed
4. `REFUNDED` - Payment refunded

---

## User Roles

- `CLIENT`: Can create missions and rate providers
- `PROVIDER`: Can accept missions and complete them
- `ADMIN`: Full access to all resources and management features
