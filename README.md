# 🍽️ Restaurant Management System - Server

This is the server-side code for the **Restaurant Management System**, built using Node.js, Express, and MongoDB. It provides a robust backend API to manage restaurant operations such as menus, orders, users, reservations, and staff.

## 🚀 Features

- User Authentication (JWT-based)
- Role-based access control (Admin, Staff, Customer)
- CRUD for Menu Items
- Order Management
- Table Reservation System
- Staff Management
- Review and Rating System
- RESTful API with proper error handling

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- dotenv for environment configuration
- bcrypt for password hashing
- CORS and Helmet for security
- Morgan for logging

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/restaurant-management-server.git
   cd restaurant-management-server


Method | Endpoint | Description | Access
POST | /api/auth/register | Register a new user | Public
POST | /api/auth/login | Login user and return JWT | Public
GET | /api/users/me | Get current user info | Authenticated
GET | /api/menu | Get all menu items | Public
POST | /api/menu | Add new menu item | Admin only
PUT | /api/menu/:id | Update menu item | Admin only
DELETE | /api/menu/:id | Delete menu item | Admin only
POST | /api/orders | Create new order | Authenticated
GET | /api/orders | Get all orders (Admin/Staff) | Admin/Staff