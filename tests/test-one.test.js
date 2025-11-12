import { test, assert, expect, describe } from 'vitest';

describe('Basic Math Operations', () => {
  test('addition works correctly', () => {
    expect(2 + 2).toBe(4);
  });

  test('subtraction works correctly', () => {
    expect(5 - 3).toBe(2);
  });
});

// Alternative: using 'test' directly without describe
test('simple assertion test', () => {
  expect(true).toBe(true);
});

test('using assert for equality', () => {
  assert.equal(10 - 5, 5);
});

test('using assert for truthiness', () => {
  assert.ok(1 + 1 === 2);
});

test('using expect for greater than', () => {
  expect(10).toBeGreaterThan(5);
});

test('using expect for array containment', () => {
  expect([1, 2, 3]).toContain(2);
});

describe('String Operations', () => {
  test('concatenation works correctly', () => {
    expect('Hello, ' + 'World!').toBe('Hello, World!');
  });
});