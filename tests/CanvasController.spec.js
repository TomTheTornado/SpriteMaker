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
  describe('when passing in -1', function() {
    it('should throw an exception', () => {
      assert.throws(() => create2DArray(-1), Error, "");
    });
  });
  describe('when passing in 0', function() {
    it('should throw an exception', () => {
      assert.throws(() => create2DArray(0), Error, "");
    });
  });
  describe('when passing in 4.9', function() {
    it('should create an array with 5 rows.', () => {
      var arr = [
          [],
          [],
          [],
          [],
          []
      ];

      assert.equal(JSON.stringify(arr), JSON.stringify(create2DArray(4.9)));
    });
  });
  describe('when passing in the string "a"', function() {
    it('should throw an exception', () => {
      assert.throws(() => create2DArray(a), Error, "");
    });
  });
});