import { View, StyleSheet, Text } from 'react-native';
import { AirbnbRating } from '@rn-vui/ratings';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Rating</Text>
      <AirbnbRating
        count={11}
        showRating={true}
        reviews={[
          'Terrible',
          'Bad',
          'Meh',
          'OK',
          'Good',
          'Hmm...',
          'Very Good',
          'Wow',
          'Amazing',
          'Unbelievable',
          'Jesus',
        ]}
        defaultRating={11}
        size={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
