import React, { useCallback, useEffect } from 'react';

import {
  View,
  Text,
  Animated,
  PanResponder,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

// RATING IMAGES WITH STATIC BACKGROUND COLOR (white)
const STAR_IMAGE = require('./images/star.png');
const HEART_IMAGE = require('./images/heart.png');
const ROCKET_IMAGE = require('./images/rocket.png');
const BELL_IMAGE = require('./images/bell.png');

const TYPES: {
  [key: string]: {
    source: any;
    color: string;
    backgroundColor: string;
  };
} = {
  star: {
    source: STAR_IMAGE,
    color: '#f1c40f',
    backgroundColor: 'white',
  },
  heart: {
    source: HEART_IMAGE,
    color: '#e74c3c',
    backgroundColor: 'white',
  },
  rocket: {
    source: ROCKET_IMAGE,
    color: '#2ecc71',
    backgroundColor: 'white',
  },
  bell: {
    source: BELL_IMAGE,
    color: '#f39c12',
    backgroundColor: 'white',
  },
  custom: {
    source: STAR_IMAGE,
    color: '#f1c40f',
    backgroundColor: 'white',
  },
};

//@ts-ignore
const fractionsType: any = (props, propName, componentName) => {
  if (props[propName]) {
    const value = props[propName];

    if (typeof value === 'number') {
      return value >= 0 && value <= 20
        ? null
        : new Error(
            `\`${propName}\` in \`${componentName}\` must be between 0 and 20`
          );
    }

    return new Error(
      `\`${propName}\` in \`${componentName}\` must be a number`
    );
  }
};

export type SwipeRatingProps = {
  /**
   * Graphic used for represent a rating
   *
   * @default star
   */
  type?: 'star' | 'heart' | 'rocket' | 'bell' | 'custom';

  /**
   * Pass in a custom image source; use this along with type='custom' prop above
   */
  ratingImage?: React.ReactNode;

  /**
   * Pass in a custom fill-color for the rating icon; use this along with type='custom' prop above
   *
   * @default '#f1c40f'
   */
  ratingColor?: string;

  /**
   * Pass in a custom background-fill-color for the rating icon; use this along with type='custom' prop above
   *
   * @default 'white'
   */
  ratingBackgroundColor?: string;

  /**
   * Number of rating images to display
   *
   * @default 5
   */
  ratingCount?: number;

  /**
   * Color used for the text labels
   *
   * @default #f1c40f
   */
  ratingTextColor?: string;

  /**
   * The size of each rating image
   *
   * @default 50
   */
  imageSize?: number;

  /**
   * Callback method when the user starts rating.
   */
  onStartRating?: (value: number) => void;

  /**
   * Callback method when the user finishes rating. Gives you the final rating value as a whole number
   */
  onFinishRating?: (value: number) => void;

  /**
   * Displays the Built-in Rating UI to show the rating value in real-time
   *
   * @default false
   */
  showRating?: boolean;

  /**
   * Exposes style prop to add additional styling to the container view
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Whether the rating can be modified by the user
   *
   * @default false
   */
  readonly?: boolean;

  /**
   * Whether the text is read only
   *
   * @default false
   */
  showReadOnlyText?: boolean;

  /**
   * The initial rating to render
   *
   * @default ratingCount/2
   */
  startingValue?: number;

  /**
   * The number of decimal places for the rating value; must be between 0 and 20
   *
   * @default 0
   */
  fractions?: typeof fractionsType;

  /**
   * The minimum value the user can select
   *
   * @default 0
   */
  minValue?: number;

  /**
   * Callback method when the user is swiping.
   */
  onSwipeRating?: (value: number) => void;

  /**
   * Color used for the background
   */
  tintColor?: string;

  /**
   * The number to jump per swipe
   *
   * @default 0 (not to jump)
   */
  jumpValue?: number;
};

const SwipeRating: React.FC<SwipeRatingProps> = ({
  type = 'star',
  ratingImage = STAR_IMAGE,
  ratingColor,
  ratingBackgroundColor = 'white',
  ratingTextColor = TYPES[type]?.color,
  ratingCount = 5,
  showReadOnlyText = false,
  imageSize = 50,
  minValue = 0,
  jumpValue = 0,
  onStartRating = () => {},
  onSwipeRating = () => {},
  onFinishRating = () => {},
  fractions,
  readonly = false,
  style,
  showRating = false,
  startingValue = ratingCount / 2,
}) => {
  const position = React.useRef(new Animated.Value(0)).current;
  const ratingRef = React.useRef<any>(null);
  const ratingBackdropValue = React.useRef<number>(0);
  const centerX = React.useRef<number>(0);
  const [currentRatingValue, setCurrentRatingValue] =
    React.useState<number>(startingValue);

  const setCurrentRating = React.useCallback(
    (rating: number) => {
      // `initialRating` corresponds to `startingValue` in the getter. Naming it
      // Differently here avoids confusion with `value` below.
      const initialRating = ratingCount / 2;

      let localValue = null;

      if (rating > ratingCount) {
        localValue = (ratingCount * imageSize) / 2;
      } else if (rating < 0) {
        localValue = (-ratingCount * imageSize) / 2;
      } else if (rating < ratingCount / 2 || rating > ratingCount / 2) {
        localValue = (rating - initialRating) * imageSize;
      } else {
        localValue = 0;
      }
      ratingBackdropValue.current = localValue;
      position.setValue(localValue);
    },
    [ratingCount, imageSize, position]
  );

  useEffect(() => {
    setCurrentRating(startingValue);
  }, [startingValue, setCurrentRating]);

  useEffect(() => {
    if (type === 'custom') {
      const custom = {
        source: ratingImage,
        color: ratingColor,
        backgroundColor: ratingBackgroundColor,
      };

      //@ts-ignore
      TYPES.custom = custom;
    }
  }, [type, ratingImage, ratingColor, ratingBackgroundColor]);

  const getCurrentRating = useCallback(
    (localValue: number) => {
      const localStartingValue = ratingCount / 2;

      let currentRating = minValue ? minValue : 0;

      if (localValue > (ratingCount * imageSize) / 2) {
        currentRating = ratingCount;
      } else if (localValue < (-ratingCount * imageSize) / 2) {
        currentRating = minValue ? minValue : 0;
      } else if (localValue <= imageSize || localValue > imageSize) {
        const diff = localValue / imageSize;

        currentRating = localStartingValue + diff;
        currentRating = fractions
          ? Number(currentRating.toFixed(fractions))
          : Math.ceil(currentRating);
      } else {
        currentRating = fractions
          ? Number(localStartingValue.toFixed(fractions))
          : Math.ceil(localStartingValue);
      }
      if (jumpValue > 0 && jumpValue < ratingCount) {
        return Math.ceil(currentRating * (1 / jumpValue)) / (1 / jumpValue);
      } else {
        return currentRating;
      }
    },
    [ratingCount, minValue, imageSize, jumpValue, fractions]
  );

  position.addListener(({ value }) => {
    const rating = getCurrentRating(value);
    setCurrentRatingValue(rating);
  });

  const panResponderOnGrant = useCallback(
    //@ts-ignore
    (event, gesture) => {
      const tapPositionX = gesture.x0 - centerX.current + gesture.dx;
      ratingBackdropValue.current = tapPositionX;
      position.setValue(tapPositionX);
      const rating = getCurrentRating(tapPositionX);
      onStartRating(rating);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // [getCurrentRating, onStartRating, position]
  );

  const panResponderOnMove = useCallback(
    // @ts-ignore
    (event, gesture) => {
      const tapPositionX = gesture.x0 - centerX.current + gesture.dx;
      ratingBackdropValue.current = tapPositionX;
      position.setValue(tapPositionX);
      const rating = getCurrentRating(tapPositionX);
      onSwipeRating(rating);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // [getCurrentRating, onSwipeRating, position]
  );

  const panResponderOnRelease = useCallback(
    () => {
      const rating = getCurrentRating(ratingBackdropValue.current);

      if (rating >= minValue) {
        if (!fractions) {
          // 'round up' to the nearest rating image
          setCurrentRating(rating);
        }
        onFinishRating(rating);
      }
    },
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // [getCurrentRating, fractions, onFinishRating, setCurrentRating, minValue]
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: panResponderOnGrant,
        onPanResponderMove: panResponderOnMove,
        onPanResponderRelease: panResponderOnRelease,
      }),
    [panResponderOnGrant, panResponderOnMove, panResponderOnRelease]
  );

  const handleLayoutChange = () => {
    //@ts-ignore
    ratingRef.current.measure((fx, fy, width, height, px) => {
      const halfWidth = width / 2;
      const pageXWithinWindow = px % Dimensions.get('window').width;
      centerX.current = pageXWithinWindow + halfWidth;
    });
  };

  const getPrimaryViewStyle = () => {
    const color = TYPES[type]?.color;

    const width = position.interpolate({
      inputRange: [
        -ratingCount * (imageSize / 2),
        0,
        ratingCount * (imageSize / 2),
      ],
      outputRange: [0, (ratingCount * imageSize) / 2, ratingCount * imageSize],
      extrapolate: 'clamp',
    });

    return {
      backgroundColor: color,
      width,
      height: width ? imageSize : 0,
    };
  };

  const getSecondaryViewStyle = () => {
    const backgroundColor = TYPES[type]?.backgroundColor;

    const width = position.interpolate({
      inputRange: [
        -ratingCount * (imageSize / 2),
        0,
        ratingCount * (imageSize / 2),
      ],
      outputRange: [ratingCount * imageSize, (ratingCount * imageSize) / 2, 0],
      extrapolate: 'clamp',
    });

    return {
      backgroundColor,
      width,
      height: width ? imageSize : 0,
    };
  };

  const renderRatings = React.useMemo(() => {
    const source = TYPES[type]?.source;
    return Array.from({ length: ratingCount }, (_, index) => (
      <View key={index} style={styles.starsWrapper} testID="RNVUI__Star">
        <Image
          source={source}
          testID="RNVUI__Star-image"
          style={{
            width: imageSize,
            height: imageSize,
            tintColor: ratingColor,
          }}
        />
      </View>
    ));
  }, [ratingCount, imageSize, ratingColor, type]);

  return (
    <View
      pointerEvents={readonly ? 'none' : 'auto'}
      style={style}
      testID="RNVUI__SwipeRating"
    >
      {showRating && (
        <View
          style={styles.showRatingView}
          testID="RNVUI__SwipeRating-showRating"
        >
          <View style={styles.ratingView}>
            <Text style={[styles.ratingText, { color: ratingTextColor }]}>
              Rating:{' '}
            </Text>
            <Text
              style={[styles.currentRatingText, { color: ratingTextColor }]}
            >
              {currentRatingValue}
            </Text>
            <Text style={[styles.maxRatingText, { color: ratingTextColor }]}>
              /{ratingCount}
            </Text>
          </View>
          <View>
            {readonly && showReadOnlyText && (
              <Text style={[styles.readonlyLabel, { color: ratingTextColor }]}>
                (readonly)
              </Text>
            )}
          </View>
        </View>
      )}
      <View
        style={styles.starsWrapper}
        {...panResponder.panHandlers}
        testID="RNVUI__SwipeRating-pan"
      >
        <View
          style={styles.starsInsideWrapper}
          onLayout={() => {
            handleLayoutChange();
          }}
          ref={ratingRef}
        >
          <Animated.View style={[getPrimaryViewStyle()]} />
          <Animated.View style={[getSecondaryViewStyle()]} />
        </View>
        {renderRatings}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  starsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starsInsideWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showRatingView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
  },
  ratingView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
  },
  ratingText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Trebuchet MS' : undefined,
    color: '#34495e',
  },
  readonlyLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Trebuchet MS' : undefined,
    color: '#34495a',
  },
  currentRatingText: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Trebuchet MS' : undefined,
  },
  maxRatingText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Trebuchet MS' : undefined,
    color: '#34495e',
  },
});

export default SwipeRating;
