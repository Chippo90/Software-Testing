import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [cart, setCart] = useState([]);
  const [promo, setPromo] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const m = await axios.get("http://localhost:3001/api/menu");
      setMenu(m.data);
      const c = await axios.get("http://localhost:3001/api/categories");
      setCategories(c.data);
    }
    load();
  }, []);

  const displayed = filter ? menu.filter((i) => i.category === filter) : menu;

  function addToCart(item, qty) {
    if (qty <= 0) {
      setMessage("Quantity must be positive");
      return;
    }
    setMessage("");
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + qty } : p,
        );
      }
      return [
        ...prev,
        { id: item.id, name: item.name, price: item.price, quantity: qty },
      ];
    });
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      setMessage("Quantity must be positive");
      return;
    }
    setMessage("");
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)));
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function subtotal() {
    return cart.reduce((s, it) => s + it.price * it.quantity, 0);
  }

  function total() {
    const s = subtotal();
    if (promo === "SAVE5" && s >= 10) return +(s - 5).toFixed(2);
    return +s.toFixed(2);
  }

  async function placeOrder() {
    if (!name || !contact) {
      setMessage("Name and contact required");
      return;
    }
    if (cart.length === 0) {
      setMessage("Cart empty");
      return;
    }
    setMessage("");
    try {
      const res = await axios.post("http://localhost:3001/api/orders", {
        name,
        contact,
        items: cart.map((i) => ({ id: i.id, quantity: i.quantity })),
        promo,
      });
      setMessage("Order placed: " + JSON.stringify(res.data));
      setCart([]);
    } catch (e) {
      setMessage("Order failed: " + (e.response?.data?.error || e.message));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Food Ordering App</h1>

      {/* Category filter */}
      <div>
        <label>
          Filter:
          <select
            data-testid="category-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Menu */}
      <h2>Menu</h2>
      <ul data-testid="menu-list">
        {displayed.map((it) => (
          <li key={it.id}>
            <strong>{it.name}</strong> - {it.description} ({it.category}) - €
            {it.price.toFixed(2)}
            <div>
              <button onClick={() => addToCart(it, 1)}>Add</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Cart */}
      <h2>Cart</h2>
      <ul data-testid="cart-list">
        {cart.map((it) => (
          <li key={it.id}>
            {it.name} x
            <input
              aria-label={"qty-" + it.id}
              type="number"
              value={it.quantity}
              onChange={(e) =>
                updateQuantity(it.id, parseInt(e.target.value || "0"))
              }
            />
            <button onClick={() => removeItem(it.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>Subtotal: €{subtotal().toFixed(2)}</div>
      <div>
        Promo:{" "}
        <input value={promo} onChange={(e) => setPromo(e.target.value)} />
      </div>
      <div>Total: €{total().toFixed(2)}</div>

      {/* Checkout */}
      <h2>Checkout</h2>
      <div>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <button onClick={placeOrder}>Place Order</button>
      </div>

      {/* Message alert */}
      {message && <div role="alert">{message}</div>}
    </div>
  );
}

export default App;
