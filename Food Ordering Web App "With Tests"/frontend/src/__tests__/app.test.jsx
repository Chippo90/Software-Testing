// src/__tests__/app.test.jsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  cleanup,
} from "@testing-library/react";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import App from "../App";
import axios from "axios";

vi.mock("axios");

const mockMenu = [
  {
    id: "m1",
    name: "Pizza",
    description: "Cheese",
    category: "Pizza",
    price: 8,
  },
  {
    id: "m2",
    name: "Salad",
    description: "Fresh",
    category: "Salad",
    price: 6,
  },
];

beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (url.endsWith("/api/menu")) return Promise.resolve({ data: mockMenu });
    if (url.endsWith("/api/categories"))
      return Promise.resolve({ data: ["Pizza", "Salad"] });
  });
});

// cleanup DOM after each test
afterEach(() => {
  cleanup();
});

describe("Food Ordering App", () => {
  test("User Story #1 - Menu displays items", async () => {
    render(<App />);
    const menuList = await screen.findByTestId("menu-list");
    const pizza = within(menuList).getByText("Pizza");
    const salad = within(menuList).getByText("Salad");
    expect(pizza).toBeDefined();
    expect(salad).toBeDefined();
  });

  test("User Story #2 - Filter by category", async () => {
    render(<App />);
    const filters = await screen.findAllByTestId("category-filter");
    fireEvent.change(filters[0], { target: { value: "Salad" } });

    const menuList = screen.getByTestId("menu-list");
    const salads = within(menuList).queryAllByText("Salad");
    expect(salads.length).to.be.greaterThan(0);

    const pizzas = within(menuList).queryAllByText("Pizza");
    expect(pizzas.length).to.equal(0);
  });

  test("User Story #3 - Add items to cart", async () => {
    render(<App />);
    const addBtns = await screen.findAllByText("Add");
    fireEvent.click(addBtns[0]);

    const qtyInput = await screen.findByLabelText("qty-m1");
    expect(qtyInput.value).toBe("1");
  });

  test("User Story #4 - Update and remove items in cart", async () => {
    render(<App />);
    const addBtns = await screen.findAllByText("Add");
    fireEvent.click(addBtns[0]);

    const qtyInput = await screen.findByLabelText("qty-m1");
    fireEvent.change(qtyInput, { target: { value: "3" } });
    expect(qtyInput.value).toBe("3");

    const removeBtn = screen.getByText("Remove");
    fireEvent.click(removeBtn);
    expect(screen.queryByLabelText("qty-m1")).toBeNull();
  });

  test("User Story #5 - Cart total and promo code", async () => {
    render(<App />);
    const addBtns = await screen.findAllByText("Add");
    fireEvent.click(addBtns[0]); // Pizza €8

    const nameInput = screen.getByPlaceholderText("Name");
    fireEvent.change(nameInput, { target: { value: "Test" } });
    const contactInput = screen.getByPlaceholderText("Contact");
    fireEvent.change(contactInput, { target: { value: "t@t.com" } });
    const promoInput = screen.getByDisplayValue("");
    fireEvent.change(promoInput, { target: { value: "SAVE5" } });

    // subtotal = 8, promo SAVE5 requires subtotal >=10, so total = 8
    const totalDiv = screen.getByText(/Total:/);
    expect(totalDiv.textContent).to.equal("Total: €8.00");
  });

  test("User Story #10 - Prevent checkout if fields missing", async () => {
    render(<App />);

    // Add first item to cart
    const addBtns = await screen.findAllByText("Add");
    fireEvent.click(addBtns[0]);

    // Explicitly clear name/contact to ensure empty
    const nameInput = screen.getByPlaceholderText("Name");
    fireEvent.change(nameInput, { target: { value: "" } });
    const contactInput = screen.getByPlaceholderText("Contact");
    fireEvent.change(contactInput, { target: { value: "" } });

    // Click Place Order
    const placeOrderBtn = screen.getByText("Place Order");
    fireEvent.click(placeOrderBtn);

    // Wait for alert to appear
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).to.include("Name and contact required");
  });
});
