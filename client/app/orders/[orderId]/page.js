import { getOrder } from "@/app/actions/getOrder";
import OrderTimeOut from "@/components/orderTimeOut";
import StripeCheckoutComponent from "@/components/StripeCheckoutComponent";
import { headers as nextHeaders } from "next/headers";

const OrderShow = async ({ params }) => {
  const { orderId } = params;

  // Get the headers from the request context (in server context)
  const requestHeaders = nextHeaders();

  // Construct the URL for fetching the single order
  const url = `/api/orders/${orderId}`;

  // Fetch the order data
  const order = await getOrder(url, requestHeaders);

  if (!order) {
    return <div>Order not found</div>;
  }

  // Calculate the time left for the order to expire
  const timeLeft = new Date(order.expiresAt) - new Date();

  return (
    <div>
      <OrderTimeOut order={order} message="seconds until order expires" />
      <StripeCheckoutComponent order={order} />
    </div>
  );
};

export default OrderShow;
