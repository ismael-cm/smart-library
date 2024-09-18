import React,  { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ElibHome from '../screens/elib-home';
import ElibProfile from '../screens/elib-profile';

export default function Stacks(){

    
    const Stack = createNativeStackNavigator();
    
    return(
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='ElibLogin' screenOptions={{headerShown: false}}>
                <Stack.Screen name="ElibRegister" component={ElibRegister}/>
                <Stack.Screen name="ElibLogin" component={ElibLogin}/>
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}