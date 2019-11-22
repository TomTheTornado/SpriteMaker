let assert = chai.assert;

describe('Create2DArray', function() {
  describe('when passing in 3', function() {
    it('should create an array with 3 rows.', () => {
      var arr = [
          [],
          [],
          []
      ];

      assert.equal(JSON.stringify(arr), JSON.stringify(create2DArray(3)));
    });
  });
});

describe('CanvasThing', function() {
  describe('when passing in a mocked canvas', function() {
    it('should blah blah blah', () => {
      var arr = [
          [],
          [],
          []
      ];

      assert.equal(JSON.stringify(arr), JSON.stringify(create2DArray(3)));
    });
  });
});