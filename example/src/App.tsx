import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import TapRatingScreen from './TapRatingScreen';
import SwipeRatingScreen from './SwipeRatingScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          //@ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'TapRating') {
              return <Ionicons name="star" size={size} color={color} />;
            } else if (route.name === 'SwipeRating') {
              return <Ionicons name="star-outline" size={size} color={color} />;
            }

            return <Ionicons size={size} color={color} />;
          },
        })}
        // tabBarOptions={{
        //   activeTintColor: 'tomato',
        //   inactiveTintColor: 'gray',
        // }}
      >
        <Tab.Screen name="TapRating" component={TapRatingScreen} />
        <Tab.Screen name="SwipeRating" component={SwipeRatingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
