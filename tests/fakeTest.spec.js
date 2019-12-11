let assert = chai.assert;
describe('Test', function() {
  describe('when passing in true in assert.equal()', function() {
    it('should return true', () => {
      assert.equal(true, true);
    });
  });
});