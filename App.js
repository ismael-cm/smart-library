import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ElibRegister from './frontend/src/screens/elib-register';
import ElibLogin from './frontend/src/screens/elib-login';
import ElibHome from './frontend/src/screens/elib-home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ElibProfile from './frontend/src/screens/elib-profile';
import Tabs from './frontend/src/components/tabs';
import ElibSearch from './frontend/src/screens/elib-seach';
import ElibBook from './frontend/src/screens/elib-book';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='ElibLogin' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ElibRegister" component={ElibRegister} />
          <Stack.Screen name="ElibLogin" component={ElibLogin} />
          <Stack.Screen name="ElibSearch" component={ElibSearch} />
          <Stack.Screen name="ElibBook" component={ElibBook}/>
          <Stack.Screen name="Tabs" component={Tabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
