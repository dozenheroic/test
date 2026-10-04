import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateSubtotal,
  applyDiscount,
  calculateDelivery,
  calculateTotal
} from '../src/orderCalculator.js';

test('рассчитывает стоимость одного товара', () => {
  const items = [
    { name: 'Клавиатура', price: 2500, quantity: 1 }
  ];

  const result = calculateSubtotal(items);

  assert.equal(result, 2500);
});

test('пустая корзина имеет стоимость 0', () => {
  const items = [];

  const result = calculateSubtotal(items);

  assert.equal(result, 0);
});

test('рассчитывает стоимость нескольких товаров', () => {
  const items = [
    { name: 'Клавиатура', price: 2500, quantity: 1 },
    { name: 'Кабель', price: 500, quantity: 2 }
  ];

  const result = calculateSubtotal(items);

  assert.equal(result, 3500);
});

test('учитывает количество товара больше одного', () => {
  const items = [
    { name: 'Кабель', price: 500, quantity: 3 }
  ];

  const result = calculateSubtotal(items);

  assert.equal(result, 1500);
});

test('отрицательная цена товара приводит к ошибке', () => {
  const items = [
    { name: 'Товар', price: -100, quantity: 1 }
  ];

  assert.throws(
    () => calculateSubtotal(items),
    /Price cannot be negative/
  );
});

test('нулевое количество товара приводит к ошибке', () => {
  const items = [
    { name: 'Кабель', price: 500, quantity: 0 }
  ];

  assert.throws(
    () => calculateSubtotal(items),
    /Quantity must be a positive integer/
  );
});

test('дробное количество товара приводит к ошибке', () => {
  const items = [
    { name: 'Кабель', price: 500, quantity: 1.5 }
  ];

  assert.throws(
    () => calculateSubtotal(items),
    /Quantity must be a positive integer/
  );
});

test('применяет скидку STUDENT10', () => {
  const amount = 2000;

  const result = applyDiscount(amount, 'STUDENT10');

  assert.equal(result, 1800);
});

test('применяет скидку NODE20 при сумме от 1000 рублей', () => {
  const amount = 1500;

  const result = applyDiscount(amount, 'NODE20');

  assert.equal(result, 1200);
});

test('применяет NODE20 при граничном значении 1000 рублей', () => {
  const amount = 1000;

  const result = applyDiscount(amount, 'NODE20');

  assert.equal(result, 800);
});

test('не применяет NODE20 при сумме 999 рублей', () => {
  const amount = 999;

  const result = applyDiscount(amount, 'NODE20');

  assert.equal(result, 999);
});

test('неизвестный промокод не даёт скидку', () => {
  const amount = 2000;

  const result = applyDiscount(amount, 'UNKNOWN');

  assert.equal(result, 2000);
});

test('курьерская доставка стоит 300 рублей при сумме менее 3000', () => {
  const amount = 2000;

  const result = calculateDelivery(amount, 'courier');

  assert.equal(result, 300);
});

test('курьерская доставка бесплатна при сумме ровно 3000', () => {
  const amount = 3000;

  const result = calculateDelivery(amount, 'courier');

  assert.equal(result, 0);
});

test('самовывоз бесплатный', () => {
  const amount = 1000;

  const result = calculateDelivery(amount, 'pickup');

  assert.equal(result, 0);
});

test('неизвестный тип доставки приводит к ошибке', () => {
  const amount = 1000;

  assert.throws(
    () => calculateDelivery(amount, 'unknown'),
    /Unknown delivery type/
  );
});

const discountCases = [
  {
    name: 'STUDENT10 даёт скидку 10%',
    amount: 2000,
    promoCode: 'STUDENT10',
    expected: 1800
  },
  {
    name: 'NODE20 даёт скидку 20% при сумме 1500',
    amount: 1500,
    promoCode: 'NODE20',
    expected: 1200
  },
  {
    name: 'NODE20 не даёт скидку при сумме 999',
    amount: 999,
    promoCode: 'NODE20',
    expected: 999
  },
  {
    name: 'неизвестный промокод не даёт скидку',
    amount: 2000,
    promoCode: 'UNKNOWN',
    expected: 2000
  }
];

for (const testCase of discountCases) {
  test(`параметризованная проверка: ${testCase.name}`, () => {
    const amount = testCase.amount;
    const promoCode = testCase.promoCode;

    const result = applyDiscount(amount, promoCode);

    assert.equal(result, testCase.expected);
  });
}

test('рассчитывает итоговую стоимость заказа с промокодом и доставкой', () => {
  const order = {
    items: [
      { name: 'Клавиатура', price: 2500, quantity: 1 },
      { name: 'Кабель', price: 500, quantity: 2 }
    ],
    promoCode: 'STUDENT10',
    deliveryType: 'courier'
  };

  const result = calculateTotal(order);

  assert.equal(result, 3150);
});