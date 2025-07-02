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
    orderStatus,
    getOrderStatus,
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
    const taxRate = 0.05;
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
          addons: [],
        },
      ],
      phoneNumber: phoneNumber,
      firstName: customerInfo.name,
      lastName: "",
      addressId: "1",
      deliveryTime: selectedDeliveryTime,
      deliveryDate: selectedDeliveryDate,
      paymentMethod,
    };

    try {
      const result = await submitOrder(orderData);
      console.log("Order submission result:", result);

      if (result.success) {
        console.log("Moving to step 5 with real order ID:", result.realOrderId);
        setStep(5);

        setTimeout(() => {
          onConfirm({
            ...orderData,
            orderId: result.realOrderId,
            customerInfo,
            specialInstructions,
          });
        }, 0);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to submit order. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Current step:", step);
  }, [step]);

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

  const renderStep4 = () => {
    // Automatically set delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Set default delivery time
    const defaultTime = "12:00-13:00";

    // Set the values automatically if they're not set
    if (!selectedDeliveryDate) {
      setSelectedDeliveryDate(formatDate(tomorrow));
    }
    if (!selectedDeliveryTime) {
      setSelectedDeliveryTime(defaultTime);
    }

    return (
      <div className="product-details-content">
        <h2 className="step-title">Order Summary</h2>

        <div className="delivery-details">
          <div className="delivery-info">
            <h3>Delivery Information</h3>
            <p>
              Your order will be delivered tomorrow between 12:00 PM - 1:00 PM
            </p>
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
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      </div>
    );
  };

  const renderOrderStatus = () => {
    console.log("Rendering order status, current orderStatus:", orderStatus);
    return (
      <div className="product-details-content">
        <h2 className="step-title">Order Status</h2>

        <div className="order-status-container">
          {orderStatus ? (
            <>
              <div className="order-status-info">
                <h3>Order Status</h3>
                <div className="status-details">
                  {orderStatus.response_data &&
                  orderStatus.response_data.length > 0 ? (
                    <>
                      <div className="status-box">
                        <p className="status-text">
                          Status:{" "}
                          <span className="status-value">
                            {orderStatus.response_data[0].stage_lang ||
                              orderStatus.response_data[0].stage}
                          </span>
                        </p>
                        <p className="order-id">
                          Order ID: #
                          {orderStatus.response_data[0].order_id ||
                            "Processing"}
                        </p>
                        {orderStatus.response_code[2] && (
                          <p className="delivery-estimate">
                            {orderStatus.response_code[2]}
                          </p>
                        )}
                        {orderStatus.response_data[0].can_cancel_order ===
                          "1" && (
                          <p className="cancel-info">
                            * You can still cancel this order if needed
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p>Processing your order...</p>
                  )}
                </div>
              </div>

              <div className="order-summary-status">
                <h4>Order Summary</h4>
                <p>
                  <strong>Product:</strong> {product.name}
                </p>
                <p>
                  <strong>Quantity:</strong> {quantity}
                </p>
                <p>
                  <strong>Total:</strong> $
                  {(
                    (product.discountedPrice || product.price) * quantity
                  ).toFixed(2)}
                </p>
                <p>
                  <strong>Delivery Time:</strong> {selectedDeliveryTime}
                </p>
                <p>
                  <strong>Delivery Date:</strong> {selectedDeliveryDate}
                </p>
                <p>
                  <strong>Customer Name:</strong> {customerInfo.name}
                </p>
                <p>
                  <strong>Phone:</strong> {phoneNumber}
                </p>
                <p>
                  <strong>Car Details:</strong> {customerInfo.carColor}{" "}
                  {customerInfo.carModel} ({customerInfo.carPlate})
                </p>
              </div>
            </>
          ) : (
            <div className="loading-status">
              <p>Loading order status...</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>

        <button className="close-button-status" onClick={onClose}>
          Close
        </button>
      </div>
    );
  };

  // Add useEffect to handle step 5 persistence and status updates
  useEffect(() => {
    if (step === 5) {
      console.log("Step 5 effect triggered");

      // Set up periodic status updates
      const statusInterval = setInterval(async () => {
        if (orderStatus?.response_data?.[0]?.stage !== "Delivered") {
          const result = await getOrderStatus(
            orderStatus?.response_data?.[0]?.order_id
          );
          console.log("Status update:", result);
        }
      }, 30000); // Update every 30 seconds

      // Cleanup interval on unmount or step change
      return () => clearInterval(statusInterval);
    }
  }, [step, orderStatus, getOrderStatus]);

  const renderCurrentStep = () => {
    console.log("Rendering step:", step);
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        console.log("Should render order status now");
        return renderOrderStatus();
      default:
        return null;
    }
  };

  return (
    <div className="product-details-overlay">
      <div className="product-details-container">
        {step !== 5 && (
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        )}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default ProductDetails;
