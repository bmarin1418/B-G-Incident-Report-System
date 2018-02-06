'use strict';

describe('ngJsonQuery', function () {
  beforeEach(module('ngJsonQuery'));

  it('should be function', inject(function (jsonQuery) {
     expect(jsonQuery).toEqual(jasmine.any(Function));
  }));
});
