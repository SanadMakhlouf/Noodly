import { useState } from "react";

export const useOrderSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  const generateOrderId = () =>
    `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("971")) return `+${digits}`;
    if (digits.startsWith("0")) return `+971${digits.substring(1)}`;
    return `+971${digits}`;
  };

  const registerCustomer = async ({
    firstName = "Guest",
    lastName = "",
    phoneNumber,
  }) => {
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const registerData = {
        request_type: "user_registration",
        app_id: "16",
        shop_id: "17",
        access_token: "A#25t*4M",
        language: "english",
        first_name: firstName,
        email: "",
        mobile_no: formattedPhone,
      };

      const response = await fetch(
        "https://shopapi.aipsoft.com/app_request/get_data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerData),
        }
      );

      const data = await response.json();
      console.log("Registration response:", data);

      if (
        data.response_code === "1" &&
        data.response_data?.response_data?.user_id
      ) {
        const pmId = data.response_data.response_data.user_id.toString();
        localStorage.setItem("pm_id", pmId);
        console.log("Successfully registered user with PM_ID:", pmId);
        return pmId;
      }

      console.warn("Invalid registration response. Using fallback pm_id.");
      return "352";
    } catch (err) {
      console.error("Registration error:", err);
      return "352"; // fallback
    }
  };

  const submitOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    setOrderSuccess(false);

    try {
      const orderId = generateOrderId();

      const pmId = await registerCustomer({
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        phoneNumber: orderData.phoneNumber,
      });

      const orderPayload = {
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
        address_id: orderData.addressId || "123",
        pm_id: pmId,
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        }
      );

      const data = await response.json();
      console.log("Save order response:", data);

      if (!response.ok) throw new Error("Failed to submit order");

      // Get the real order ID from response_code[1]
      const realOrderId = data?.response_code?.[1];
      console.log("Real order ID from response:", realOrderId);

      if (realOrderId) {
        // Fetch the order status using the real order ID
        const statusData = await getOrderStatus(realOrderId);
        console.log("Initial status data:", statusData);
      }

      setOrderSuccess(true);
      return {
        success: true,
        orderId: orderId, // The generated ID used for saving
        realOrderId: realOrderId, // The ID from response_code[1] used for status
        message: "Order submitted successfully",
      };
    } catch (err) {
      console.error("Order submission error:", err);
      setError("Failed to submit order. Please try again.");
      return {
        success: false,
        error: "Failed to submit order. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatus = async (orderId) => {
    try {
      console.log("Fetching status for real order ID:", orderId);
      const statusPayload = {
        request_type: "get_last_status",
        language: "english",
        shop_id: "17",
        access_token: "A#25t*4M",
        order_id: orderId, // Using the real order ID from response_code[1]
        domain_id: "1",
      };

      const response = await fetch(
        "https://shopapi.aipsoft.com/app_request/get_data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(statusPayload),
        }
      );

      const data = await response.json();
      console.log("Order status response:", data);

      if (data.response_code === "2") {
        throw new Error(data.response_text || "Failed to fetch order status");
      }

      setOrderStatus(data);
      return data;
    } catch (err) {
      console.error("Error fetching order status:", err);
      setError("Failed to fetch order status");
      return null;
    }
  };

  return {
    submitOrder,
    loading,
    error,
    orderSuccess,
    orderStatus,
    getOrderStatus,
  };
};
