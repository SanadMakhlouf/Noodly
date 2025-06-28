import React, { useState } from "react";
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

  const handleConfirm = () => {
    onConfirm({
      ...product,
      quantity,
      specialInstructions,
      phoneNumber,
      customerInfo,
      totalPrice: (product.discountedPrice || product.price) * quantity,
    });
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
      <div className="order-summary">
        <div className="summary-item order-details">
          <h3>Your Order</h3>
          <div className="order-item">
            <img
              src={product.image}
              alt={product.name}
              className="summary-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/noodle-placeholder.jpg";
              }}
            />
            <div className="order-item-details">
              <h4>{product.name}</h4>
              <p>Quantity: {quantity}</p>
              <p className="item-price">
                Price: $
                {(
                  (product.discountedPrice || product.price) * quantity
                ).toFixed(2)}
              </p>
            </div>
          </div>
          {specialInstructions && (
            <div className="special-notes">
              <strong>Special Instructions:</strong>
              <p>{specialInstructions}</p>
            </div>
          )}
        </div>

        <div className="summary-item">
          <h3>Contact Information</h3>
          <p>Phone: {phoneNumber}</p>
        </div>

        <div className="summary-item">
          <h3>Car Details</h3>
          <p>Name: {customerInfo.name}</p>
          <p>Car Model: {customerInfo.carModel}</p>
          <p>Car Color: {customerInfo.carColor}</p>
          <p>Car Plate: {customerInfo.carPlate}</p>
        </div>

        <div className="summary-item payment-method">
          <h3>Payment Method</h3>
          <div className="payment-badge">
            <span className="arabic-text">الدفع عند الاستلام</span>
            <span className="english-text">Cash on Delivery</span>
          </div>
        </div>

        <div className="summary-item total-amount">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>
              $
              {((product.discountedPrice || product.price) * quantity).toFixed(
                2
              )}
            </span>
          </div>
          <div className="total-row grand-total">
            <span>Total Amount:</span>
            <span>
              $
              {((product.discountedPrice || product.price) * quantity).toFixed(
                2
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button className="back-button" onClick={handlePrevStep}>
          Back
        </button>
        <button className="confirm-button" onClick={handleConfirm}>
          <span className="arabic-text">تأكيد الطلب</span>
          <span className="english-text">Confirm Order</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="product-details-overlay">
      <div className="product-details-container">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
          <div className={`step ${step >= 4 ? "active" : ""}`}>4</div>
        </div>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default ProductDetails;
