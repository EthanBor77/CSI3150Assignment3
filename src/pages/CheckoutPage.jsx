import { useState } from "react";
import { Link } from "react-router-dom";

function CheckoutPage({ cart, onClearCart }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
  });

  const [errors, setErrors] = useState({});

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const taxes = subtotal * 0.06;
  const total = subtotal + taxes;

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function validateForm() {
    const newErrors = {};

    if (formData.fullName.trim() === "") {
      newErrors.fullName = "Full name is required.";
    }
    if (formData.address.trim() === "") {
      newErrors.address = "Address is required.";
    }
    if (formData.city.trim() === "") {
      newErrors.city = "City is required.";
    }
    if (!/^[0-9]{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Postal code must be 5 digits.";
    }
    if (!/^[0-9]{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits (no spaces).";
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitted(true);
    onClearCart();
  }

  if (isSubmitted) {
    return (
      <div className="checkout-success">
        <h2>Order Placed Successfully</h2>
        <p>
          Thank you, {formData.fullName}. Your records will ship to{" "}
          {formData.address}, {formData.city} {formData.postalCode}.
        </p>
        <Link className="btn btn-primary" to="/">
          Return to HomePage
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart-page">
        <h2>Your cart is empty.</h2>
        <Link className="btn btn-secondary" to="/">
          Browse the catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout and Order Confirmation</h1>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h2>Shipping Information</h2>
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="form-error">{errors.fullName}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
            />
            {errors.city && <p className="form-error">{errors.city}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code *</label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
            {errors.postalCode && (
              <p className="form-error">{errors.postalCode}</p>
            )}
          </div>

          <h2>Payment Details</h2>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number *</label>
            <input
              type="text"
              name="cardNumber"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
            />
            {errors.cardNumber && (
              <p className="form-error">{errors.cardNumber}</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Complete Order (${total.toFixed(2)})
          </button>
        </form>

        <aside className="order-summary-card">
          <h3>Order Summary</h3>
          <ul className="summary-list">
            {cart.map((item) => (
              <li key={item.id} className="summary-row">
                <span>
                  {item.title} &times; {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <hr />
          <div className="summary-row">
            <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Estimated Tax (6%):</span> <span>${taxes.toFixed(2)}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total:</span> <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
