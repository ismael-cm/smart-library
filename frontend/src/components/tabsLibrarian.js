import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from '../screens/ElibLibrarianHome.js';
import Perfil from '../screens/elib-profile';
import Prestamos from '../screens/elib-loan-management';
import Chat from '../screens/elib-chat.js';

export default function TabsLibrarian() {
    const Tab = createBottomTabNavigator();
    return (
<Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            height: 70,
            backgroundColor: '#ffffff',
            borderRadius: 15,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 10,
            elevation: 10,
        },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Perfil') iconName = 'person';
            else if (route.name === 'Prestamos') iconName = 'bookmarks';
            else if (route.name === 'Chat') iconName = 'chatbox';

            return <Icon name={iconName} size={size - 5} color={color} />;
        },
        tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#2bba52' : 'gray', fontSize: 11, marginBottom: 5 }}>
                {route.name}
            </Text>
        ),
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#2bba52',
        tabBarInactiveTintColor: 'gray',
    })}
>
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Perfil" component={Perfil} />
    {/*<Tab.Screen name="Prestamos" component={Prestamos} />*/} 
    <Tab.Screen name="Chat" component={Chat} />
</Tab.Navigator>

    );
}
