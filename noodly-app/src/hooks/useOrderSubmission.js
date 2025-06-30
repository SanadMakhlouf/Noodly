import { useState } from "react";

export const useOrderSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const generateOrderId = () =>
    `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const submitOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    setOrderSuccess(false);

    try {
      const orderId = generateOrderId();

      const jsonData = {
        request_type: "save_order",
        shop_id: "17",
        access_token: "A#25t*4M",
        tax_less_amount: orderData.taxLessAmount.toString(),
        tax_amount: orderData.taxAmount,
        products: orderData.products.map((product) => ({
          id: product.id,
          name: product.name,
          is_multi_unit: "FALSE",
          unit_id: 1602,
          price: product.price,
          product_image: product.image || "",
          quantity: product.quantity,
          comments: "",
          addons: product.addons || [],
          customize: "1",
          cart_id: 1,
          addon_total_price: 0,
          total_price: (product.price * product.quantity).toFixed(2),
        })),
        address_id: orderData.addressId,
        pm_id: "352",
        delivery_time: orderData.deliveryTime || "",
        pickup_time: "",
        lat: "24.483019805499488",
        lng: "54.349997706376534",
        delivery_time_required: "",
        pickup_time_required: "",
        delivery_charge: "10",
        vehicle_info: null,
      };

      const response = await fetch(
        "https://shopapi.aipsoft.com/app_request/get_data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        }
      );

      if (!response.ok) throw new Error("Failed to submit order");

      setOrderSuccess(true);
      return {
        success: true,
        orderId,
        message: "Order submitted successfully",
      };
    } catch (err) {
      setError("Failed to submit order. Please try again.");
      return {
        success: false,
        error: "Failed to submit order. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  return { submitOrder, loading, error, orderSuccess };
};
