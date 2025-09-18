const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let menu = [
  {
    id: "m1",
    name: "Margherita Pizza",
    description: "Tomato, mozzarella",
    category: "Pizza",
    price: 8.5,
  },
  {
    id: "m2",
    name: "Pepperoni Pizza",
    description: "Pepperoni, cheese",
    category: "Pizza",
    price: 9.5,
  },
  {
    id: "m3",
    name: "Caesar Salad",
    description: "Lettuce, dressing",
    category: "Salad",
    price: 6.0,
  },
  {
    id: "m4",
    name: "Spaghetti Bolognese",
    description: "Meat sauce",
    category: "Pasta",
    price: 10.0,
  },
  {
    id: "m5",
    name: "Tiramisu",
    description: "Coffee dessert",
    category: "Dessert",
    price: 4.5,
  },
];

let orders = {}; // in-memory store

// GET /api/menu
app.get("/api/menu", (req, res) => {
  res.json(menu);
});

// GET unique categories
app.get("/api/categories", (req, res) => {
  const cats = [...new Set(menu.map((i) => i.category))];
  res.json(cats);
});

// POST /api/orders
app.post("/api/orders", (req, res) => {
  const { name, contact, items, promo } = req.body || {};
  if (!name || !contact || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }
  // validate item quantities and existence
  for (const it of items) {
    if (!it.id || typeof it.quantity !== "number" || it.quantity <= 0) {
      return res.status(400).json({ error: "Invalid item in order" });
    }
    if (!menu.find((m) => m.id === it.id)) {
      return res.status(400).json({ error: "Unknown menu item" });
    }
  }
  // compute total
  let subtotal = 0;
  for (const it of items) {
    const menuItem = menu.find((m) => m.id === it.id);
    subtotal += menuItem.price * it.quantity;
  }
  let total = subtotal;
  if (promo === "SAVE5" && subtotal >= 10) total = +(subtotal - 5).toFixed(2);

  const id = uuidv4();
  const order = {
    id,
    name,
    contact,
    items,
    subtotal,
    total,
    status: "received",
    createdAt: new Date().toISOString(),
  };
  orders[id] = order;
  res.status(201).json({ id, total, status: order.status });
});

// GET all orders
app.get("/api/orders", (req, res) => {
  res.json(Object.values(orders));
});

// GET order by id
app.get("/api/orders/:id", (req, res) => {
  const o = orders[req.params.id];
  if (!o) return res.status(404).json({ error: "Order not found" });
  res.json(o);
});

// PUT /api/orders/:id/status
app.put("/api/orders/:id/status", (req, res) => {
  const o = orders[req.params.id];
  if (!o) return res.status(404).json({ error: "Order not found" });
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: "status required" });
  o.status = status;
  res.json(o);
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
}
module.exports = app;
