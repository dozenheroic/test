import test from 'node:test';
import assert from 'node:assert/strict';

import { placeOrder } from '../src/orderService.js';

test('оформляет заказ и возвращает ID платежа', async () => {
  const order = {
    items: [
      { name: 'Клавиатура', price: 1000, quantity: 1 }
    ],
    promoCode: null,
    deliveryType: 'pickup'
  };

  let paidAmount = null;
  let payCalls = 0;

  const paymentService = {
    async pay(amount) {
      payCalls++;
      paidAmount = amount;
      return 'payment-123';
    }
  };

  const result = await placeOrder(order, paymentService);

  assert.equal(result, 'payment-123');
  assert.equal(paidAmount, 1000);
  assert.equal(payCalls, 1);
});

test('ошибка оплаты передаётся вызывающему коду', async () => {
  const order = {
    items: [
      { name: 'Клавиатура', price: 1000, quantity: 1 }
    ],
    promoCode: null,
    deliveryType: 'pickup'
  };

  const paymentService = {
    async pay() {
      throw new Error('Payment failed');
    }
  };

  await assert.rejects(
    () => placeOrder(order, paymentService),
    /Payment failed/
  );
});