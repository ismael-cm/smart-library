import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ElibHome from '../screens/elib-home';
import ElibProfile from '../screens/elib-profile';
import ElibLoan from '../screens/elib-loan';

export default function Tabs() {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            className='absolute w-full h-20 bottom-6 pr-4 pl-4 bg-green-600'
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    left: 30,
                    right: 30,
                    elevation: 0,
                    backgroundColor: '#ffffff',
                    borderRadius: 15,
                    height: 70,
                    padding:17,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.15,    
                    shadowRadius: 12.5,
                },
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;
        
                    if (route.name === 'ElibHome') {
                      iconName = 'home';
                    } else if (route.name === 'ElibProfile') {
                      iconName = 'person';
                    }else if (route.name === 'ElibLoan') {
                        iconName = 'bookmarks';
                      }
        
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarShowLabel:false,
                tabBarActiveTintColor: '#2bba52', // Color del icono activo
                tabBarInactiveTintColor: 'gray', 
            })}
        >
            <Tab.Screen name="ElibHome" component={ElibHome} />
            <Tab.Screen name="ElibProfile" component={ElibProfile} />
            <Tab.Screen name="ElibLoan" component={ElibLoan} />
        </Tab.Navigator>
    );
}