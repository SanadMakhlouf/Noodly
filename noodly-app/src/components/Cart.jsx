import React, { useState, useEffect } from "react";
import "../styles/Cart.css";

const Cart = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClose,
  onCheckout,
}) => {
  // Local state to track quantities for immediate UI updates
  const [localQuantities, setLocalQuantities] = useState({});

  // Initialize local quantities from props
  useEffect(() => {
    const quantities = {};
    items.forEach((item) => {
      quantities[item.id] = item.quantity;
    });
    setLocalQuantities(quantities);
  }, [items]);

  const handleQuantityChange = (itemId, newQuantity) => {
    // Update local state immediately for responsive UI
    setLocalQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));

    // Then update parent state
    onUpdateQuantity(itemId, newQuantity);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      // Use local quantity if available, otherwise use item quantity
      const quantity =
        localQuantities[item.id] !== undefined
          ? localQuantities[item.id]
          : item.quantity;
      return total + price * quantity;
    }, 0);
  };

  return (
    <div className="cart-modal">
      <div className="cart-content">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/noodle-placeholder.jpg";
                    }}
                  />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <div className="price">
                      {item.discountedPrice ? (
                        <span>{item.discountedPrice.toFixed(2)} AED</span>
                      ) : (
                        <span>{item.price.toFixed(2)} AED</span>
                      )}
                    </div>
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            (localQuantities[item.id] || item.quantity) - 1
                          )
                        }
                        disabled={
                          (localQuantities[item.id] || item.quantity) <= 1
                        }
                      >
                        -
                      </button>
                      <span style={{ color: "black" }}>
                        {localQuantities[item.id] || item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            (localQuantities[item.id] || item.quantity) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => {
                      // Update local state first
                      setLocalQuantities((prev) => {
                        const newState = { ...prev };
                        delete newState[item.id];
                        return newState;
                      });
                      // Then update parent state
                      onRemoveItem(item.id);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="total">
                <span>Total:</span>
                <span>{calculateTotal().toFixed(2)} AED</span>
              </div>
              <button className="checkout-button" onClick={onCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
