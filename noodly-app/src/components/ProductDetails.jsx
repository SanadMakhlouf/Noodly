import React, { useState, useEffect } from "react";
import { useOrderSubmission } from "../hooks/useOrderSubmission";
import "../styles/ProductDetails.css";

const ProductDetails = ({
  product,
  onClose,
  onConfirm,
  showStatusOnly = false,
}) => {
  const [step, setStep] = useState(showStatusOnly ? 5 : 1);
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
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");

  const {
    submitOrder,
    loading: orderLoading,
    error: submitError,
    orderSuccess,
    orderStatus,
    firstOrderElement,
    getOrderStatus,
  } = useOrderSubmission();

  // Load order details and fetch status when component mounts
  useEffect(() => {
    // If showing status only, load from localStorage
    if (showStatusOnly) {
      loadOrderDetailsAndFetchStatus();
    }

    // If we're at step 5 (after order placement), set up auto-refresh
    if (step === 5) {
      const statusInterval = setInterval(() => {
        refreshOrderStatus();
      }, 30000);

      return () => clearInterval(statusInterval);
    }
  }, [step, showStatusOnly]);

  // Function to load order details from localStorage
  const loadOrderDetailsAndFetchStatus = () => {
    const lastOrderId = localStorage.getItem("lastOrderId");
    const lastOrderDetails = localStorage.getItem("lastOrderDetails");

    if (lastOrderId && lastOrderDetails) {
      try {
        const details = JSON.parse(lastOrderDetails);

        // Set all the state from the stored order details
        if (details.customerInfo) {
          setCustomerInfo(details.customerInfo);
        }

        if (details.product) {
          setQuantity(details.product.quantity || 1);
        }

        if (details.phoneNumber) {
          setPhoneNumber(details.phoneNumber);
        }

        if (details.deliveryTime) {
          setSelectedDeliveryTime(details.deliveryTime);
        }

        if (details.deliveryDate) {
          setSelectedDeliveryDate(details.deliveryDate);
        }

        if (details.specialInstructions) {
          setSpecialInstructions(details.specialInstructions);
        }

        // Fetch the order status immediately
        getOrderStatus(lastOrderId);
      } catch (err) {
        console.error("Error loading order details:", err);
      }
    }
  };

  // Function to refresh order status
  const refreshOrderStatus = () => {
    // If we have an order status with an order ID, use that
    if (orderStatus?.response_data?.[0]?.order_id) {
      getOrderStatus(orderStatus.response_data[0].order_id);
    }
    // Otherwise try to get it from localStorage
    else {
      const lastOrderId = localStorage.getItem("lastOrderId");
      if (lastOrderId) {
        getOrderStatus(lastOrderId);
      }
    }
  };

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
            disabled={orderLoading}
          >
            {orderLoading ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      </div>
    );
  };

  const renderOrderStatus = () => {
    console.log("Rendering order status, current orderStatus:", orderStatus);
    console.log("First order element:", firstOrderElement);

    // Get the API response from localStorage
    const apiResponseStr = localStorage.getItem("lastOrderApiResponse");
    const apiResponse = apiResponseStr ? JSON.parse(apiResponseStr) : null;

    // If we're showing status only and there's no order data
    if (showStatusOnly && !localStorage.getItem("lastOrderId")) {
      return (
        <div className="product-details-content">
          <h2 className="step-title">Order Status</h2>
          <div className="order-status-container">
            <div className="no-order-message">
              <p>
                No recent orders found. Place an order to track its status here.
              </p>
            </div>
          </div>
          <button className="close-button-status" onClick={onClose}>
            Close
          </button>
        </div>
      );
    }

    // Get order details from localStorage for display
    const orderDetails = localStorage.getItem("lastOrderDetails")
      ? JSON.parse(localStorage.getItem("lastOrderDetails"))
      : null;

    // Get the first element of response_code from the saved API response
    const savedFirstElement = apiResponse?.response_code?.[0] || null;

    return (
      <div className="product-details-content">
        <h2 className="step-title">Order Status</h2>

        <div className="order-status-container">
          {orderStatus ? (
            <>
              <div className="order-status-info">
                <h3>Order Status</h3>
                <div className="status-details">
                  <div className="status-box">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <p className="status-text" style={{ margin: 0 }}>
                        Status:{" "}
                        <span className="status-value">
                          {savedFirstElement || "Processing"}
                        </span>
                      </p>
                      <button
                        onClick={refreshOrderStatus}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#f0f0f0",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Refresh
                      </button>
                    </div>

                    <p
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        margin: "10px 0",
                        color: "#4CAF50",
                      }}
                    >
                      Submitted Order
                    </p>
                  </div>
                </div>
              </div>

              <div className="order-summary-status">
                <h4>Order Summary</h4>
                {orderDetails ? (
                  <>
                    <p>
                      <strong>Product:</strong> {orderDetails.product.name}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {orderDetails.product.quantity}
                    </p>
                    <p>
                      <strong>Total:</strong> ${orderDetails.totalAmount}
                    </p>
                    <p>
                      <strong>Delivery Time:</strong>{" "}
                      {orderDetails.deliveryTime}
                    </p>
                    <p>
                      <strong>Delivery Date:</strong>{" "}
                      {orderDetails.deliveryDate}
                    </p>
                    <p>
                      <strong>Customer Name:</strong>{" "}
                      {orderDetails.customerInfo.name}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {orderDetails.customerInfo.phoneNumber}
                    </p>
                    <p>
                      <strong>Car Details:</strong>{" "}
                      {orderDetails.customerInfo.carColor}{" "}
                      {orderDetails.customerInfo.carModel} (
                      {orderDetails.customerInfo.carPlate})
                    </p>
                    {orderDetails.specialInstructions && (
                      <>
                        <h4>Special Instructions</h4>
                        <p>{orderDetails.specialInstructions}</p>
                      </>
                    )}
                  </>
                ) : (
                  <p>Order details not available</p>
                )}
              </div>

              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  margin: "10px 0",
                  color: "#4CAF50",
                }}
              >
                Submitted Order
              </p>
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
