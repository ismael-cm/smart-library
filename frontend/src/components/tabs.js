import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from '../screens/elib-home';
import Perfil from '../screens/elib-profile';
import Prestamos from '../screens/elib-loan-management';
import Chat from '../screens/elib-chat.js';

export default function Tabs() {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 10,
                    left: 20,
                    right: 20,
                    elevation: 20,
                    backgroundColor: '#ffffff',
                    borderRadius: 15,
                    height: 60,
                    padding: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                },
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Perfil') {
                        iconName = 'person';
                    } else if (route.name === 'Prestamos') {
                        iconName = 'bookmarks';
                    } else if (route.name === 'Chat') {
                        iconName = 'chatbox';
                    }

                    return <Icon name={iconName} size={size - 2} color={color} />;
                },
                tabBarLabel: ({ focused }) => (
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 0, marginBottom: 10 }}>
                        <Text style={{ color: focused ? '#2bba52' : 'gray', fontSize: 11 }}>
                            {route.name}
                        </Text>
                    </View>
                ),
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#2bba52', // Color del icono activo
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Perfil" component={Perfil} />
            <Tab.Screen name="Prestamos" component={Prestamos} />
            <Tab.Screen name="Chat" component={Chat} />
        </Tab.Navigator>
    );
}
