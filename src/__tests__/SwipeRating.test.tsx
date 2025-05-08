import { render } from '@testing-library/react-native';
import SwipeRating from '../SwipeRating';

describe('SwipeRating', () => {
  it('should export SwipeRating', () => {
    const SwipeRatingLocal = require('../SwipeRating');
    expect(SwipeRatingLocal).toBeDefined();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<SwipeRating />); //to ensure default props are not changed
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with custom props', () => {
    const ratingsCount = 9;

    const { getAllByTestId } = render(
      <SwipeRating ratingCount={ratingsCount} />
    );
    const stars = getAllByTestId('RNVUI__Star');
    expect(stars).toHaveLength(ratingsCount);
  });

  it('should render with different type', () => {
    const heartImage = require('../images/heart.png');
    const { getAllByTestId } = render(<SwipeRating type="heart" />);
    const swipeRatings = getAllByTestId('RNVUI__Star-image');

    swipeRatings.forEach((swipeRating) => {
      expect(swipeRating.props.source).toEqual(heartImage); // Check if the image source is the heart image
    });
  });

  // it('should render with custom image', () => {
  //   const customImage = require('../images/bell.png');
  //   const { getAllByTestId } = render(
  //     <SwipeRating type="custom" ratingImage={customImage} />
  //   );
  //   const swipeRatings = getAllByTestId('RNVUI__Star-image');

  //   swipeRatings.forEach((swipeRating) => {
  //     expect(swipeRating.props.source).toEqual(customImage); // Check if the image source is the custom image
  //   });
  // });
});
