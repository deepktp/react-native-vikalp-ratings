import { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { AirbnbRating } from '@rn-vui/ratings';

import Card from './Card';
const WATER_IMAGE = require('../assets/water.png');

class TapRatingScreen extends Component {
  ratingCompleted(rating: number) {
    console.log(`Rating is: ${rating}`);
  }

  render() {
    return (
      <SafeAreaView style={styles.flex}>
        {Platform.OS === 'android' ? <StatusBar /> : null}

        <View style={styles.headingContainer}>
          <Text style={styles.titleText}>Tap Rating</Text>
          <Text style={styles.subtitleText}>
            Airbnb-style ratings with tap gesture.
          </Text>
        </View>
        <ScrollView style={styles.flex} contentContainerStyle={styles.center}>
          <Card title="DEFAULT" containerStyle={styles.card}>
            <AirbnbRating showRating={false} />
          </Card>
          <Card title="WITH RATING" containerStyle={styles.card}>
            <AirbnbRating showRating={true} />
          </Card>
          <Card
            title="WITH CUSTOM RATING CONTAINER STYLE"
            containerStyle={styles.card}
          >
            <AirbnbRating
              showRating={true}
              ratingContainerStyle={{
                alignSelf: 'center',
                backgroundColor: '#ede7f6',
              }}
            />
          </Card>
          <Card title="CUSTOM RATING" containerStyle={styles.card}>
            <AirbnbRating
              count={10}
              showRating={true}
              reviews={[
                'Terrible',
                'Bad',
                'Meh',
                'OK',
                'Good',
                'Very Good',
                'Wow',
                'Amazing',
                'Unbelievable',
                'Jesus',
              ]}
              defaultRating={5}
              reviewSize={10}
              onFinishRating={this.ratingCompleted}
            />
          </Card>
          <Card title="CUSTOM IMAGE" containerStyle={styles.card}>
            <AirbnbRating
              onFinishRating={this.ratingCompleted}
              starImage={WATER_IMAGE}
            />
          </Card>
          <Card title="CUSTOM COLOR" containerStyle={styles.card}>
            <AirbnbRating showRating={false} selectedColor="green" />
          </Card>
          <Card title="DISABLED" containerStyle={styles.card}>
            <AirbnbRating
              isDisabled={true}
              showRating={false}
              defaultRating={4}
            />
          </Card>
          <Card
            title="CUSTOM CONTAINER STYLE *DISABLED"
            containerStyle={styles.card}
          >
            <AirbnbRating
              starContainerStyle={{
                alignSelf: 'center',
                backgroundColor: 'green',
              }}
              isDisabled={true}
              showRating={false}
              defaultRating={4}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingContainer: {
    paddingBottom: 30,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo-Bold' : undefined,
    color: '#27ae60',
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Trebuchet MS' : undefined,
    color: '#34495e',
  },
  card: {
    width: '85%',
    marginBottom: 20,
  },
});

export default TapRatingScreen;
