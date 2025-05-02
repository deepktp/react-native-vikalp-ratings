import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
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

const TYPES = {
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
  custom: {},
};

export type SwipeRatingProps = {
  type?: 'star' | 'heart' | 'rocket' | 'bell' | 'custom';
  ratingImage?: React.ReactNode;
  ratingColor?: string;
  ratingBackgroundColor?: string;
  ratingCount?: number;
  ratingTextColor?: string;
  imageSize?: number;
  onStartRating?: Function;
  onFinishRating?: Function;
  showRating?: boolean;
  style?: StyleProp<ViewStyle>;
  readonly?: boolean;
  showReadOnlyText?: boolean;
  startingValue?: number;
  fractions?: number;
  minValue?: number;
  onSwipeRating?: (value: number) => void;
  tintColor?: string;
  jumpValue?: number;
};

const SwipeRating = forwardRef((props: SwipeRatingProps, ref) => {
  const {
    type = 'star',
    ratingImage = STAR_IMAGE,
    ratingColor = '#f1c40f',
    ratingBackgroundColor = 'white',
    ratingCount = 5,
    showReadOnlyText = true,
    imageSize = 40,
    minValue = 0,
    jumpValue = 0,
    onStartRating,
    onSwipeRating,
    onFinishRating,
    fractions,
    startingValue = ratingCount / 2,
    readonly,
    showRating,
    style,
    ratingTextColor,
    tintColor,
  } = props;

  const [position] = useState(new Animated.ValueXY());
  const [value, setValue] = useState<number | undefined>(undefined);
  const [centerX, setCenterX] = useState<number | undefined>(undefined);
  const [display, setDisplay] = useState(false);
  const ratingRef = useRef<View>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      //@ts-ignore
      onPanResponderGrant: (event, gesture) => {
        const tapPositionX = gesture.x0 - (centerX || 0) + gesture.dx;
        position.setValue({ x: tapPositionX, y: 0 });
        setValue(tapPositionX);
        const rating = getCurrentRating(tapPositionX);
        if (onStartRating) onStartRating(rating);
      },

      //@ts-ignore
      onPanResponderMove: (event, gesture) => {
        const tapPositionX = gesture.x0 - (centerX || 0) + gesture.dx;
        position.setValue({ x: tapPositionX, y: 0 });
        setValue(tapPositionX);
        const rating = getCurrentRating(tapPositionX);
        if (onSwipeRating) onSwipeRating(rating);
      },
      onPanResponderRelease: () => {
        const rating = getCurrentRating(value || 0);
        if (rating >= minValue) {
          if (!fractions) setCurrentRating(rating);
          if (onFinishRating) onFinishRating(rating);
        }
      },
    })
  ).current;

  const setCurrentRating = React.useCallback(
    (rating: number) => {
      const initialRating = ratingCount / 2;
      let value = 0;

      if (rating > ratingCount) {
        value = (ratingCount * imageSize) / 2;
      } else if (rating < 0) {
        value = (-ratingCount * imageSize) / 2;
      } else {
        value = (rating - initialRating) * imageSize;
      }

      position.setValue({ x: value, y: 0 });
      setValue(value);
    },
    [ratingCount, imageSize, position]
  );

  useEffect(() => {
    setDisplay(true);
    setCurrentRating(startingValue);
  }, [startingValue, setCurrentRating]);

  useEffect(() => {
    if (ratingRef.current) {
      //@ts-ignore
      ratingRef.current.measure((fx, fy, width, height, px) => {
        const halfWidth = width / 2;
        const pageXWithinWindow = px % Dimensions.get('window').width;
        setCenterX(pageXWithinWindow + halfWidth);
      });
    }
  }, [ratingRef]);

  useImperativeHandle(ref, () => ({
    setCurrentRating,
  }));

  const getCurrentRating = (value: number) => {
    const startingValue = ratingCount / 2;
    let currentRating = minValue || 0;

    if (value > (ratingCount * imageSize) / 2) {
      currentRating = ratingCount;
    } else if (value < (-ratingCount * imageSize) / 2) {
      currentRating = minValue || 0;
    } else {
      const diff = value / imageSize;
      currentRating = startingValue + diff;
      currentRating = fractions
        ? Number(currentRating.toFixed(fractions))
        : Math.ceil(currentRating);
    }

    if (jumpValue > 0 && jumpValue < ratingCount) {
      return Math.ceil(currentRating * (1 / jumpValue)) / (1 / jumpValue);
    } else {
      return currentRating;
    }
  };

  const getPrimaryViewStyle = () => {
    //@ts-ignore
    const { color } = TYPES[type];
    const width = position.x.interpolate({
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
    //@ts-ignore
    const { backgroundColor } = TYPES[type];
    const width = position.x.interpolate({
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

  const renderRatings = () => {
    //@ts-ignore
    const { source } = TYPES[type];
    return Array.from({ length: ratingCount }).map((_, index) => (
      //@ts-ignore
      <View key={index} style={styles.starContainer}>
        <Image
          source={source}
          style={{ width: imageSize, height: imageSize, tintColor }}
        />
      </View>
    ));
  };

  const displayCurrentRating = () => {
    //@ts-ignore
    const color = ratingTextColor || TYPES[type].color;
    return (
      <View style={styles.showRatingView}>
        <View style={styles.ratingView}>
          <Text style={[styles.ratingText, { color }]}>Rating: </Text>
          <Text style={[styles.currentRatingText, { color }]}>
            {getCurrentRating(value || 0)}
          </Text>
          <Text style={[styles.maxRatingText, { color }]}>/{ratingCount}</Text>
        </View>
        {readonly && showReadOnlyText && (
          <Text style={[styles.readonlyLabel, { color }]}>(readonly)</Text>
        )}
      </View>
    );
  };

  if (type === 'custom') {
    TYPES.custom = {
      source: ratingImage,
      color: ratingColor,
      backgroundColor: ratingBackgroundColor,
    };
  }

  return display ? (
    <View pointerEvents={readonly ? 'none' : 'auto'} style={style}>
      {showRating && displayCurrentRating()}
      <View style={styles.starsWrapper} {...panResponder.panHandlers}>
        <View
          style={styles.starsInsideWrapper}
          onLayout={() => {
            if (ratingRef.current) {
              //@ts-ignore
              ratingRef.current.measure((fx, fy, width, height, px) => {
                const halfWidth = width / 2;
                const pageXWithinWindow = px % Dimensions.get('window').width;
                setCenterX(pageXWithinWindow + halfWidth);
              });
            }
          }}
          ref={ratingRef}
        >
          <Animated.View style={getPrimaryViewStyle()} />
          <Animated.View style={getSecondaryViewStyle()} />
        </View>
        {renderRatings()}
      </View>
    </View>
  ) : null;
});

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
