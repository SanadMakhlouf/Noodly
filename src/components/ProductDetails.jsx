import React, { useState, useEffect } from "react";
import { useOrderSubmission } from "../hooks/useOrderSubmission";
import "../styles/ProductDetails.css";

const ProductDetails = ({
  product,
  onClose,
  onAddToCart,
  showStatusOnly = false,
  isCartCheckout = false,
  cartItems = [],
  onOrderSuccess,
}) => {
  const [step, setStep] = useState(showStatusOnly ? 5 : 1);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "Customer",
    carModel: "",
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
    if (showStatusOnly) {
      loadOrderDetailsAndFetchStatus();
    }

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

        getOrderStatus(lastOrderId);
      } catch (err) {
        console.error("Error loading order details:", err);
      }
    }
  };

  // Function to refresh order status
  const refreshOrderStatus = () => {
    if (orderStatus?.response_data?.[0]?.order_id) {
      getOrderStatus(orderStatus.response_data[0].order_id);
    } else {
      const lastOrderId = localStorage.getItem("lastOrderId");
      if (lastOrderId) {
        getOrderStatus(lastOrderId);
      }
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      console.log(`Incrementing quantity to ${newQuantity}`);
      return newQuantity;
    });
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => {
        const newQuantity = prev - 1;
        console.log(`Decrementing quantity to ${newQuantity}`);
        return newQuantity;
      });
    }
  };

  const handleNextStep = () => {
    if (!isCartCheckout && step === 1 && quantity > 0) {
      // If not cart checkout, add to cart instead of proceeding
      console.log(`Adding to cart: ${product.name}, quantity: ${quantity}`);
      onAddToCart(product, quantity, specialInstructions);
      return;
    }

    if (step === 1 && quantity > 0) {
      setStep(2);
    } else if (step === 2 && phoneNumber.length >= 8) {
      setStep(3);
    } else if (step === 3 && customerInfo.carModel) {
      // Only require car number, not name
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = async () => {
    let orderData;

    if (isCartCheckout) {
      // Calculate totals for all cart items
      const { taxLessAmount, taxAmount, totalPrice } = cartItems.reduce(
        (acc, item) => {
          const itemPrice = item.discountedPrice || item.price;
          const itemTotal = itemPrice * item.quantity;
          const itemTax = itemTotal * 0.05;
          return {
            taxLessAmount: acc.taxLessAmount + (itemTotal - itemTax),
            taxAmount: acc.taxAmount + itemTax,
            totalPrice: acc.totalPrice + itemTotal,
          };
        },
        { taxLessAmount: 0, taxAmount: 0, totalPrice: 0 }
      );

      orderData = {
        taxLessAmount,
        taxAmount,
        products: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.discountedPrice || item.price,
          name: item.name,
          addons: [],
          specialInstructions: item.specialInstructions,
        })),
        phoneNumber,
        firstName: customerInfo.name,
        lastName: "",
        addressId: "1",
        deliveryTime: selectedDeliveryTime,
        deliveryDate: selectedDeliveryDate,
        paymentMethod,
        vehicle_info: customerInfo.carModel,
      };
    } else {
      const price = product.discountedPrice || product.price;
      const totalPrice = price * quantity;
      const taxRate = 0.05;
      const taxAmount = totalPrice * taxRate;
      const taxLessAmount = totalPrice - taxAmount;

      orderData = {
        taxLessAmount,
        taxAmount,
        products: [
          {
            id: product.id,
            quantity,
            price,
            name: product.name,
            addons: [],
            specialInstructions,
          },
        ],
        phoneNumber,
        firstName: customerInfo.name,
        lastName: "",
        addressId: "1",
        deliveryTime: selectedDeliveryTime,
        deliveryDate: selectedDeliveryDate,
        paymentMethod,
        vehicle_info: {
          model: customerInfo.carModel,
          color: customerInfo.carColor,
          plate: customerInfo.carPlate,
        },
      };
    }

    try {
      const result = await submitOrder(orderData);
      console.log("Order submission result:", result);

      if (result.success) {
        console.log("Moving to step 5 with real order ID:", result.realOrderId);

        // Clear the cart if this was a cart checkout
        if (isCartCheckout && onOrderSuccess) {
          console.log("Clearing cart after successful order");
          onOrderSuccess();
        }

        setStep(5);

        // Store order details in localStorage
        localStorage.setItem("lastOrderId", result.realOrderId);

        // Store the full order details including all cart items
        const orderDetailsToSave = {
          customerInfo,
          phoneNumber,
          deliveryTime: selectedDeliveryTime,
          deliveryDate: selectedDeliveryDate,
          specialInstructions,
          totalAmount: isCartCheckout
            ? cartItems
                .reduce(
                  (total, item) =>
                    total +
                    (item.discountedPrice || item.price) * item.quantity,
                  0
                )
                .toFixed(2)
            : ((product.discountedPrice || product.price) * quantity).toFixed(
                2
              ),
          isCartOrder: isCartCheckout,
          products: isCartCheckout
            ? cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: (item.discountedPrice || item.price).toFixed(2),
                specialInstructions: item.specialInstructions || "",
                image: item.image,
              }))
            : [
                {
                  id: product.id,
                  name: product.name,
                  quantity: quantity,
                  price: (product.discountedPrice || product.price).toFixed(2),
                  specialInstructions: specialInstructions || "",
                  image: product.image,
                },
              ],
        };

        localStorage.setItem(
          "lastOrderDetails",
          JSON.stringify(orderDetailsToSave)
        );

        // Also store API response for status display
        if (result.apiResponse) {
          localStorage.setItem(
            "lastOrderApiResponse",
            JSON.stringify(result.apiResponse)
          );
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to submit order. Please try again.");
    }
  };

  const renderStep1 = () => {
    if (isCartCheckout) {
      return (
        <div className="product-details-content">
          <h2 className="step-title">Checkout</h2>
          <div className="order-summary">
            <h3>Cart Items</h3>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="cart-item-summary"
                style={{
                  marginBottom: "15px",
                  padding: "15px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "15px",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/noodle-placeholder.jpg";
                    }}
                  />
                  <div>
                    <h3
                      style={{
                        margin: "0 0 5px 0",
                        fontSize: "16px",
                        color: "#2d3436",
                      }}
                    >
                      {item.name}
                    </h3>
                    <p style={{ margin: "2px 0", color: "#636e72" }}>
                      Quantity: {item.quantity} ×{" "}
                      {(item.discountedPrice || item.price).toFixed(2)} AED
                    </p>
                    <p
                      style={{
                        margin: "2px 0",
                        fontWeight: "bold",
                        color: "var(--noodly-blue)",
                      }}
                    >
                      {(
                        (item.discountedPrice || item.price) * item.quantity
                      ).toFixed(2)}{" "}
                      AED
                    </p>
                    {item.specialInstructions && (
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          fontStyle: "italic",
                          color: "#636e72",
                          fontSize: "14px",
                        }}
                      >
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                textAlign: "right",
                paddingTop: "15px",
                borderTop: "1px solid #e1e8ed",
                marginTop: "15px",
              }}
            >
              <h3 style={{ color: "var(--noodly-blue)", margin: "0" }}>
                Total:{" "}
                {cartItems
                  .reduce(
                    (total, item) =>
                      total +
                      (item.discountedPrice || item.price) * item.quantity,
                    0
                  )
                  .toFixed(2)}{" "}
                AED
              </h3>
            </div>
          </div>

          <div className="button-group">
            <button className="next-button" onClick={handleNextStep}>
              Next
            </button>
          </div>
        </div>
      );
    }

    return (
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
                  {product.price.toFixed(2)} AED
                </span>
                <span className="discounted-price">
                  {product.discountedPrice.toFixed(2)} AED
                </span>
              </>
            ) : (
              <span className="price">{product.price.toFixed(2)} AED</span>
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
              {((product.discountedPrice || product.price) * quantity).toFixed(
                2
              )}{" "}
              AED
            </span>
          </div>

          <button className="next-button" onClick={handleNextStep}>
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

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
          <label htmlFor="carModel">Car Number:</label>
          <input
            type="text"
            id="carModel"
            value={customerInfo.carModel}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, carModel: e.target.value })
            }
            placeholder="Enter your car number"
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
          disabled={!customerInfo.name || !customerInfo.carModel}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Generate time slots
    const generateTimeSlots = () => {
      const slots = [];
      const now = new Date();
      const today = new Date().toISOString().split("T")[0];
      let startHour = selectedDeliveryDate === today ? now.getHours() + 1 : 15; // 3:30 PM = 15:30
      const endHour = 23; // 11 PM

      if (startHour < 15) startHour = 15;

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute of [0, 30]) {
          if (hour === 15 && minute === 0) continue; // Skip 3:00 PM
          const timeString = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
          slots.push(timeString);
        }
      }

      return slots;
    };

    return (
      <div className="product-details-content">
        <h2 className="step-title">Order Summary</h2>

        <div className="delivery-details">
          <div className="delivery-info">
            <div className="form-group">
            
            </div>

         

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method:</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="COD">Payment on Pickup</option>
              </select>
            </div>
          </div>
        </div>

        <div className="order-summary">
          <h3>Order Details</h3>
          {isCartCheckout ? (
            // Multiple products in cart
            cartItems.map((item) => (
              <div key={item.id}>
                <p>
                  <strong>Product:</strong> {item.name}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Price per item:</strong>{" "}
                  {(item.discountedPrice || item.price).toFixed(2)} AED
                </p>
                <p>
                  <strong>Subtotal:</strong>{" "}
                  {(
                    (item.discountedPrice || item.price) * item.quantity
                  ).toFixed(2)}{" "}
                  AED
                </p>
                {item.specialInstructions && (
                  <p>
                    <strong>Special Instructions:</strong>{" "}
                    {item.specialInstructions}
                  </p>
                )}
                <hr
                  style={{ margin: "15px 0", borderTop: "1px dashed #e1e8ed" }}
                />
              </div>
            ))
          ) : (
            // Single product
            <>
              <p>
                <strong>Product:</strong> {product.name}
              </p>
              <p>
                <strong>Quantity:</strong> {quantity}
              </p>
              <p>
                <strong>Price per item:</strong>{" "}
                {(product.discountedPrice || product.price).toFixed(2)} AED
              </p>
              <p>
                <strong>Total:</strong>{" "}
                {(
                  (product.discountedPrice || product.price) * quantity
                ).toFixed(2)}{" "}
                AED
              </p>
            </>
          )}

          {isCartCheckout && (
            <p
              className="total-price"
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                textAlign: "right",
              }}
            >
              <strong>Total:</strong>{" "}
              {cartItems
                .reduce(
                  (total, item) =>
                    total +
                    (item.discountedPrice || item.price) * item.quantity,
                  0
                )
                .toFixed(2)}{" "}
              AED
            </p>
          )}

          <h3>Customer Details</h3>

          <p>
            <strong>Phone:</strong> {phoneNumber}
          </p>
          <p>
            <strong>Car Number:</strong> {customerInfo.carModel}
          </p>

          {specialInstructions && !isCartCheckout && (
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
                          {savedFirstElement ||
                            firstOrderElement ||
                            "Processing"}
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
                    
                    <div className="cooking-animation-simple">
                      <div className="cooking-indicator">
                        <i className="fas fa-utensils"></i>
                      </div>
                    </div>

                    <div className="order-status-message">
                      <p className="status-main">Your order is being prepared!</p>
                      <p className="status-time">Estimated ready time: 15-20 minutes</p>
                    </div>
                    
                    <div className="pickup-location">
                      <h4>Pickup Location</h4>
                      <a 
                        href="https://maps.app.goo.gl/5dbywSUVo7qPHaVu5?g_st=ipc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="location-link"
                      >
                        <i className="fas fa-map-marker-alt"></i>
                        Noodly - Al Shawamekh, Abu Dhabi
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-summary-status">
                <h4>Order Summary</h4>
                {orderDetails?.products && orderDetails.products.length > 0 ? (
                  // Show all products from the order
                  <>
                    {orderDetails.products.map((item, index) => (
                      <div key={index} style={{ marginBottom: "15px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                          }}
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/noodle-placeholder.jpg";
                              }}
                            />
                          )}
                          <div style={{ flex: "1" }}>
                            <p
                              style={{
                                margin: "0 0 5px 0",
                                fontWeight: "bold",
                              }}
                            >
                              {item.name} × {item.quantity}
                            </p>
                            <p style={{ margin: "0", color: "#666" }}>
                              {item.price} AED
                            </p>
                            {item.specialInstructions && (
                              <p
                                style={{
                                  margin: "5px 0 0 0",
                                  fontStyle: "italic",
                                  fontSize: "14px",
                                  color: "#666",
                                }}
                              >
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                        <hr
                          style={{
                            margin: "10px 0",
                            borderTop: "1px dashed #e1e8ed",
                          }}
                        />
                      </div>
                    ))}
                    <p
                      style={{
                        fontWeight: "bold",
                        textAlign: "right",
                        marginTop: "15px",
                      }}
                    >
                      <strong>Total:</strong> {orderDetails.totalAmount} AED
                    </p>
                  </>
                ) : (
                  <p>Order details not available</p>
                )}

                {orderDetails && (
                  <>
                    <h4>Delivery Information</h4>
                    <p>
                      <strong>Delivery Time:</strong>{" "}
                      {orderDetails.deliveryTime}
                    </p>
                    <p>
                      <strong>Delivery Date:</strong>{" "}
                      {orderDetails.deliveryDate}
                    </p>

                    <h4>Customer Information</h4>

                    <p>
                      <strong>Phone:</strong> {orderDetails.phoneNumber}
                    </p>
                    <p>
                      <strong>Car Number:</strong>{" "}
                      {orderDetails.customerInfo?.carModel}
                    </p>
                  </>
                )}
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
