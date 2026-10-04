import { calculateTotal } from './orderCalculator.js';

export async function placeOrder(order, paymentService) {
  const total = calculateTotal(order);

  const paymentId = await paymentService.pay(total);

  return paymentId;
}