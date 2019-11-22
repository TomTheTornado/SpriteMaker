<<<<<<< HEAD
var assert = require('assert');

describe('Test', function() {
  describe('when passing in true in assert.equal()', function() {
    it('should return true', () => {
      assert.equal(true, true);
    });
  });
=======
let assert = chai.assert;
describe('Test', function() {
  describe('when passing in true in assert.equal()', function() {
    it('should return true', () => {
      assert.equal(true, true);
    });
  });
>>>>>>> b35f2ec0f97e5e9a28efb7a25ab42875db10d294
});