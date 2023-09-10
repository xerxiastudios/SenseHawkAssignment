import * as React from 'react';
import { LogBox } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapboxGL from '@rnmapbox/maps';

import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';

MapboxGL.setConnected(true);
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYWJoaXNoZWtiaXN3YXMiLCJhIjoiY2xtYTc1a2trMGRqMzNobDVkaDhiNmJsNCJ9.72RCUYZTh1AGwAXkLT_Tjw',
);

LogBox.ignoreLogs([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
]);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ChatList" component={ChatListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
