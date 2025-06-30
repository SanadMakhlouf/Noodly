import React, { useState, useEffect } from "react";
import { useOrderSubmission } from "../hooks/useOrderSubmission";
import "../styles/ProductDetails.css";

const ProductDetails = ({ product, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    carModel: "",
    carColor: "",
    carPlate: "",
  });
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState("");
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");

  const {
    submitOrder,
    loading,
    error: submitError,
    orderSuccess,
  } = useOrderSubmission();

  useEffect(() => {
    console.log("Selected Product ID:", product.id);
    console.log("Selected Product Details:", product);
  }, [product]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && quantity > 0) {
      setStep(2);
    } else if (step === 2 && phoneNumber.length >= 8) {
      setStep(3);
    } else if (
      step === 3 &&
      customerInfo.name &&
      customerInfo.carModel &&
      customerInfo.carColor &&
      customerInfo.carPlate
    ) {
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = async () => {
    const price = product.discountedPrice || product.price;
    const totalPrice = price * quantity;
    const taxRate = 0.05; // 5% tax rate
    const taxAmount = totalPrice * taxRate;
    const taxLessAmount = totalPrice - taxAmount;

    const orderData = {
      taxLessAmount,
      taxAmount,
      products: [
        {
          id: product.id,
          quantity,
          price,
          name: product.name,
          addons: [], // Add addon support if needed
        },
      ],
      phoneNumber: phoneNumber,
      firstName: customerInfo.name,
      lastName: "",
      addressId: "1", // You might want to make this dynamic
      deliveryTime: selectedDeliveryTime,
      deliveryDate: selectedDeliveryDate,
      paymentMethod,
    };

    try {
      const result = await submitOrder(orderData);

      if (result.success) {
        onConfirm({
          ...orderData,
          orderId: result.orderId,
          customerInfo,
          specialInstructions,
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to submit order. Please try again.");
    }
  };

  const renderStep1 = () => (
    <div className="product-details-content">
      <div className="product-details-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-details-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/noodle-placeholder.jpg";
          }}
        />
      </div>

      <div className="product-details-info">
        <h2 className="product-details-name">{product.name}</h2>
        <p className="product-details-description">{product.description}</p>

        <div className="product-details-price">
          {product.discountedPrice > 0 ? (
            <>
              <span className="original-price">
                ${product.price.toFixed(2)}
              </span>
              <span className="discounted-price">
                ${product.discountedPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="price">${product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="quantity-control">
          <span>Quantity:</span>
          <div className="quantity-buttons">
            <button onClick={handleDecrement}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncrement}>+</button>
          </div>
        </div>

        <div className="special-instructions">
          <label htmlFor="instructions">Special Instructions:</label>
          <textarea
            id="instructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests?"
            rows="3"
          />
        </div>

        <div className="total-section">
          <span>Total:</span>
          <span className="total-price">
            $
            {((product.discountedPrice || product.price) * quantity).toFixed(2)}
          </span>
        </div>

        <button className="next-button" onClick={handleNextStep}>
          Next
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="product-details-content">
      <h2 className="step-title">Enter Your Phone Number</h2>
      <div className="phone-input-container">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          className="phone-input"
        />
        {phoneNumber.length < 8 && (
          <p className="input-error">Phone number must be at least 8 digits</p>
        )}
      </div>
      <div className="button-group">
        <button className="back-button" onClick={handlePrevStep}>
          Back
        </button>
        <button
          className="next-button"
          onClick={handleNextStep}
          disabled={phoneNumber.length < 8}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="product-details-content">
      <h2 className="step-title">Enter Your Details</h2>
      <div className="customer-info-form">
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={customerInfo.name}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, name: e.target.value })
            }
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="carModel">Car Model:</label>
          <input
            type="text"
            id="carModel"
            value={customerInfo.carModel}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, carModel: e.target.value })
            }
            placeholder="Enter your car model"
          />
        </div>
        <div className="form-group">
          <label htmlFor="carColor">Car Color:</label>
          <input
            type="text"
            id="carColor"
            value={customerInfo.carColor}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, carColor: e.target.value })
            }
            placeholder="Enter your car color"
          />
        </div>
        <div className="form-group">
          <label htmlFor="carPlate">Car Plate Number:</label>
          <input
            type="text"
            id="carPlate"
            value={customerInfo.carPlate}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, carPlate: e.target.value })
            }
            placeholder="Enter your car plate number"
          />
        </div>
      </div>
      <div className="button-group">
        <button className="back-button" onClick={handlePrevStep}>
          Back
        </button>
        <button
          className="next-button"
          onClick={handleNextStep}
          disabled={
            !customerInfo.name ||
            !customerInfo.carModel ||
            !customerInfo.carColor ||
            !customerInfo.carPlate
          }
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="product-details-content">
      <h2 className="step-title">Order Summary</h2>

      <div className="delivery-details">
        <div className="form-group">
          <label htmlFor="deliveryDate">Delivery Date:</label>
          <input
            type="date"
            id="deliveryDate"
            value={selectedDeliveryDate}
            onChange={(e) => setSelectedDeliveryDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deliveryTime">Delivery Time:</label>
          <select
            id="deliveryTime"
            value={selectedDeliveryTime}
            onChange={(e) => setSelectedDeliveryTime(e.target.value)}
            required
          >
            <option value="">Select a time slot</option>
            <option value="09:00-10:00">9:00 AM - 10:00 AM</option>
            <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
            <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
            <option value="12:00-13:00">12:00 PM - 1:00 PM</option>
            <option value="13:00-14:00">1:00 PM - 2:00 PM</option>
            <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
            <option value="15:00-16:00">3:00 PM - 4:00 PM</option>
            <option value="16:00-17:00">4:00 PM - 5:00 PM</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>
      </div>

      <div className="order-summary">
        <h3>Order Details</h3>
        <p>
          <strong>Product:</strong> {product.name}
        </p>
        <p>
          <strong>Quantity:</strong> {quantity}
        </p>
        <p>
          <strong>Price per item:</strong> $
          {(product.discountedPrice || product.price).toFixed(2)}
        </p>
        <p>
          <strong>Total:</strong> $
          {((product.discountedPrice || product.price) * quantity).toFixed(2)}
        </p>

        <h3>Customer Details</h3>
        <p>
          <strong>Name:</strong> {customerInfo.name}
        </p>
        <p>
          <strong>Phone:</strong> {phoneNumber}
        </p>
        <p>
          <strong>Car Model:</strong> {customerInfo.carModel}
        </p>
        <p>
          <strong>Car Color:</strong> {customerInfo.carColor}
        </p>
        <p>
          <strong>Car Plate:</strong> {customerInfo.carPlate}
        </p>

        {specialInstructions && (
          <>
            <h3>Special Instructions</h3>
            <p>{specialInstructions}</p>
          </>
        )}

        {submitError && <div className="error-message">{submitError}</div>}
      </div>

      <div className="button-group">
        <button className="back-button" onClick={handlePrevStep}>
          Back
        </button>
        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={loading || !selectedDeliveryDate || !selectedDeliveryTime}
        >
          {loading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className="product-details-overlay">
      <div className="product-details-container">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default ProductDetails;
