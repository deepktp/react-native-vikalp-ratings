describe('index', () => {
  it('should export Rating and AirbnbRating', () => {
    const { Rating, AirbnbRating } = require('../index');
    expect(Rating).toBeDefined();
    expect(AirbnbRating).toBeDefined();
  });
});
