function onePlusOne(a, b) {
  return a + b;
}

describe('hello', function() {
  it('1 + 1 =', function() {
    expect(onePlusOne(1, 1)).toBe(2)
  })
})