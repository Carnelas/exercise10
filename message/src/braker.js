const CircuitBraker = require("brakes");

const circuitBreakOptions = {
  timeout: 1000,
  threshold: 1,
  waitThreshold: 2,
  circuitDuration: 20000,
  statInterval: 2000
};

const braker = new CircuitBraker(circuitBreakOptions);

module.exports = braker;
