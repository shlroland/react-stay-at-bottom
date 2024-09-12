import { test, expect } from 'vitest'

function sum(a: number, b: number) {
  return a + b
}

test('sum', () => {
  expect(sum(1, 2)).toBe(3)
})
