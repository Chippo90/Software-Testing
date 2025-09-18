Food Ordering App

A small-scale web application for online food ordering, built with React (Vite) on the frontend and Node.js (Express) on the backend.

This project was developed as part of the B215 Software Testing course and demonstrates software development principles, automated testing, static testing, defect logging, and coverage reporting.

A. Features

- View restaurant menu (items with name, description, category, price).

- Filter menu items by category.

- Add items to a cart with chosen quantities.

- Update quantities or remove items from the cart.

- Apply promo code SAVE5 for discounts.

- Checkout with customer name and contact.

- Place orders and receive an order ID.

- View orders (admin).

- Update order status (admin).

- Frontend prevents checkout if mandatory fields are missing.

B. Installation & Setup

1. Clone the repository

  https://github.com/Chippo90/Software-Testing.git

2. Backend Setup

cd backend

npm install

npm start    


3. Frontend Setup

cd frontend

npm install

npm run dev   


C. Testing

Backend

- Jest + Supertest

- Covers /api/menu, /api/orders, /api/orders/:id, /api/orders/:id/status.

Fontend

- Vitest + React Testing Library + jsdom

- Covers user stories: menu rendering, filtering, cart updates, checkout validation.

D. Static Testing


- ESLint used for linting (with React plugin).

- Prettier for formatting.

E. Future Improvements

- Add a persistent database (MongoDB/Postgres).

- Role-based authentication for admin/customer.

- More end-to-end tests with Cypress/Playwright.

- Responsive UI for mobile devices.

F- Author: Chehab Hany Mohamed
