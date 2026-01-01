// Minimal browser-friendly assert shim for dependencies expecting Node's assert.
function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

assert.ok = assert;
assert.strictEqual = function strictEqual(actual: any, expected: any, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${actual} to strictly equal ${expected}`);
  }
};

assert.equal = function equal(actual: any, expected: any, message?: string) {
  /* eslint eqeqeq: "off" */
  if (actual != expected) {
    throw new Error(message || `Expected ${actual} to equal ${expected}`);
  }
};

assert.fail = function fail(message?: string): never {
  throw new Error(message || 'Assertion failed');
};

export = assert;
