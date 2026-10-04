export function calculateSubtotal(items) {
  let subtotal = 0;

  for (const item of items) {
    if (item.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error('Quantity must be a positive integer');
    }

    subtotal += item.price * item.quantity;
  }

  return subtotal;
}
export function applyDiscount(amount, promoCode) {
  if (promoCode === 'STUDENT10') {
    return amount * 0.9;
  }

  if (promoCode === 'NODE20' && amount >= 1000) {
    return amount * 0.8;
  }

  return amount;
}
export function calculateDelivery(amount, deliveryType) {
  if (deliveryType === 'pickup') {
    return 0;
  }

  if (deliveryType === 'courier') {
    if (amount >= 3000) {
      return 0;
    }

    return 300;
  }

  throw new Error('Unknown delivery type');
}
export function calculateTotal(order) {
  const subtotal = calculateSubtotal(order.items);
  const discountedAmount = applyDiscount(subtotal, order.promoCode);
  const delivery = calculateDelivery(
    discountedAmount,
    order.deliveryType
  );

  return discountedAmount + delivery;
}