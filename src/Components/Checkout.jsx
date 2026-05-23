import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Checkout = ({ location }) => {

  const {
    cartItems,
    clearCart,
    totalPrice,
    tax,
    delivery,
    finalTotal
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [errors, setErrors] = useState({});

  // Prevents the empty-cart redirect from firing right after a successful payment
  const submittedRef = useRef(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });

  // Auto-fill address from geolocation
  useEffect(() => {
    if (location) {
      if (location.manualAddress) {
        setForm(prev => ({ ...prev, addressLine: location.manualAddress, city: "", pincode: "" }));
      } else {
        const generatedAddress = [
          location.house_number,
          location.road,
          location.neighbourhood,
          location.suburb,
          location.residential,
          location.village,
          location.county,
        ].filter(Boolean).join(", ") || location.display_name || "";

        const generatedCity =
          location.city || location.town || location.village ||
          location.county || location.state_district || "";

        setForm(prev => ({
          ...prev,
          addressLine: generatedAddress,
          city: generatedCity,
          pincode: location.postcode || "",
        }));
      }
    }
  }, [location]);

  // Redirect to cart only if cart is empty on initial load (not after a successful payment)
  useEffect(() => {
    if (cartItems.length === 0 && !submittedRef.current) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // ============================
  // FORM VALIDATION
  // ============================
  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim())
      newErrors.fullName = "Full name is required";

    if (!form.email.trim())
      newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";

    if (!form.phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "Enter a valid 10-digit phone number";

    if (!form.addressLine.trim())
      newErrors.addressLine = "Address is required";

    if (!form.city.trim())
      newErrors.city = "City is required";

    if (!form.pincode.trim())
      newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode.replace(/\s/g, "")))
      newErrors.pincode = "Enter a valid 6-digit pincode";

    return newErrors;
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    // Generate a fake order ID and save to order history
    const orderId = `ZAP-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      id: orderId,
      date: new Date().toLocaleDateString("en-IN"),
      items: cartItems,
      totalPrice,
      tax,
      delivery,
      finalTotal,
      paymentMethod,
      address: `${form.addressLine}, ${form.city} - ${form.pincode}`,
    };

    const existingOrders = JSON.parse(localStorage.getItem("zaptro-orders") || "[]");
    localStorage.setItem("zaptro-orders", JSON.stringify([order, ...existingOrders]));

    // Mark as submitted BEFORE clearing cart so the empty-cart
    // useEffect doesn't redirect to /cart and race against navigate("/success")
    submittedRef.current = true;
    clearCart();
    navigate("/success", { state: { orderId } });
  };

  const inputStyle = (field) => ({
    padding: "10px 14px",
    borderRadius: "8px",
    border: errors[field] ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  });

  const errorMsg = (field) =>
    errors[field] ? (
      <span style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "2px" }}>
        {errors[field]}
      </span>
    ) : null;

  return (
    <div className="checkout-container">

      {/* LEFT SIDE - BILLING + PAYMENT */}
      <div className="billing-section">
        <h2>Billing Details</h2>

        <form className="billing-form" onSubmit={handlePayment} noValidate>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={form.fullName}
              onChange={handleChange}
              style={inputStyle("fullName")}
            />
            {errorMsg("fullName")}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={handleChange}
              style={inputStyle("email")}
            />
            {errorMsg("email")}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (10 digits) *"
              value={form.phone}
              onChange={handleChange}
              style={inputStyle("phone")}
              maxLength={10}
            />
            {errorMsg("phone")}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <input
              type="text"
              name="addressLine"
              placeholder="Address *"
              value={form.addressLine}
              onChange={handleChange}
              style={inputStyle("addressLine")}
            />
            {errorMsg("addressLine")}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <input
              type="text"
              name="city"
              placeholder="City *"
              value={form.city}
              onChange={handleChange}
              style={inputStyle("city")}
            />
            {errorMsg("city")}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode (6 digits) *"
              value={form.pincode}
              onChange={handleChange}
              style={inputStyle("pincode")}
              maxLength={6}
            />
            {errorMsg("pincode")}
          </div>

          <h3 style={{ marginTop: "20px" }}>Select Payment Method</h3>

          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>

            <label className="payment-option">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit / Debit Card
            </label>

            <label className="payment-option">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>

          <button type="submit" className="pay-btn">
            Pay ₹ {finalTotal.toFixed(2)}
          </button>
        </form>
      </div>

      {/* RIGHT SIDE - ORDER SUMMARY */}
      <div className="summary-section">
        <h2>Order Summary</h2>

        {cartItems.map(item => (
          <div className="summary-item" key={item.id}>
            <span>{item.name} × {item.quantity}</span>
            <span>
              ₹ {(
                (item.priceCents / 100) *
                item.quantity
              ).toFixed(2)}
            </span>
          </div>
        ))}

        <hr />

        <div className="summary-item">
          <span>Subtotal</span>
          <span>₹ {totalPrice.toFixed(2)}</span>
        </div>

        <div className="summary-item">
          <span>Tax (5%)</span>
          <span>₹ {tax.toFixed(2)}</span>
        </div>

        <div className="summary-item">
          <span>Delivery</span>
          <span>
            {delivery === 0 ? "Free" : `₹ ${delivery}`}
          </span>
        </div>

        <hr />

        <div className="summary-total">
          <strong>Total</strong>
          <strong>₹ {finalTotal.toFixed(2)}</strong>
        </div>
      </div>

    </div>
  );
};

export default Checkout;