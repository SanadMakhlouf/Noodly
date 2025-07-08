import React, { useState, useCallback } from "react";
import { useOrderSubmission } from "../hooks/useOrderSubmission";
import "../styles/OrderStatus.css";

const OrderStatus = ({ onClose }) => {
  const { getOrderStatus, orderStatus, error } = useOrderSubmission();
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const fetchLastOrderStatus = useCallback(async () => {
    const lastOrderId = localStorage.getItem("lastOrderId");
    const savedOrderDetails = localStorage.getItem("lastOrderDetails");

    if (lastOrderId && savedOrderDetails) {
      setOrderDetails(JSON.parse(savedOrderDetails));

      setIsLoading(true);
      try {
        const result = await getOrderStatus(lastOrderId);
        if (result) {
          setFetchError(null);
        } else {
          throw new Error("Failed to fetch status");
        }
      } catch (err) {
        setFetchError(
          "Impossible de récupérer le statut de la commande. Réessayez plus tard."
        );
        console.error("Error fetching order status:", err);
      }
      setIsLoading(false);
    }
  }, [getOrderStatus]);

  // Initial fetch when component mounts
  React.useEffect(() => {
    fetchLastOrderStatus();
  }, [fetchLastOrderStatus]);

  return (
    <div className="product-details-overlay">
      <div className="product-details-container">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="product-details-content">
          <h2 className="step-title">Order Status</h2>

          <div className="order-status-container">
            {!orderDetails ? (
              <div className="no-order-message">
                Aucune commande récente trouvée. Passez une commande pour voir
                son statut ici.
              </div>
            ) : (
              <>
                <div className="order-status-info">
                  <h3>État de la Commande</h3>
                  <div className="status-details">
                    {isLoading ? (
                      <div className="loading-status">
                        <p>Chargement du statut de la commande...</p>
                      </div>
                    ) : fetchError ? (
                      <div className="error-message">
                        {fetchError}
                        <button
                          onClick={fetchLastOrderStatus}
                          style={{
                            marginLeft: "10px",
                            padding: "5px 10px",
                            backgroundColor: "#f0f0f0",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Réessayer
                        </button>
                      </div>
                    ) : orderStatus?.response_data &&
                      orderStatus.response_data.length > 0 ? (
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
                            Statut:{" "}
                            <span className="status-value">
                              {orderStatus.response_data[0].stage_lang ||
                                orderStatus.response_data[0].stage}
                            </span>
                          </p>
                          <button
                            onClick={fetchLastOrderStatus}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Actualiser
                          </button>
                        </div>
                        <p className="order-id">
                          Commande #{orderDetails.orderId}
                        </p>
                        {orderStatus.response_code[2] && (
                          <p className="delivery-estimate">
                            {orderStatus.response_code[2]}
                          </p>
                        )}
                        {orderStatus.response_data[0].can_cancel_order ===
                          "1" && (
                          <p className="cancel-info">
                            * Vous pouvez encore annuler cette commande si
                            nécessaire
                          </p>
                        )}
                      </div>
                    ) : (
                      <p>Traitement de votre commande en cours...</p>
                    )}
                  </div>
                </div>

                <div className="order-summary-status">
                  <h4>Résumé de la Commande</h4>
                  <p>
                    <strong>Produit:</strong> {orderDetails.product.name}
                  </p>
                  <p>
                    <strong>Quantité:</strong> {orderDetails.product.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> {orderDetails.totalAmount} AED
                  </p>
                  <p>
                    <strong>Heure de Livraison:</strong>{" "}
                    {orderDetails.deliveryTime}
                  </p>
                  <p>
                    <strong>Date de Livraison:</strong>{" "}
                    {orderDetails.deliveryDate}
                  </p>
                  <p>
                    <strong>Nom du Client:</strong>{" "}
                    {orderDetails.customerInfo.name}
                  </p>
                  <p>
                    <strong>Téléphone:</strong>{" "}
                    {orderDetails.customerInfo.phoneNumber}
                  </p>
                  <p>
                    <strong>Détails du Véhicule:</strong>{" "}
                    {orderDetails.customerInfo.carColor}{" "}
                    {orderDetails.customerInfo.carModel} (
                    {orderDetails.customerInfo.carPlate})
                  </p>
                  {orderDetails.specialInstructions && (
                    <>
                      <h4>Instructions Spéciales</h4>
                      <p>{orderDetails.specialInstructions}</p>
                    </>
                  )}
                </div>
              </>
            )}

            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
