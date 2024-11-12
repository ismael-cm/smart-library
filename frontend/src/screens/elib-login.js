import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SERVER_URL } from '@env';

export default function ElibLogin() {
    const navigation = useNavigation();
    const [Email, setEmail] = useState('bea@b.com');
    const [Password, setPassword] = useState('1234');
    const [Errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            console.log(SERVER_URL)
            setLoading(true);
            const response = await axios.post(`${SERVER_URL}api/login`, {
                email: Email,
                password: Password,
            });

            /*if (response.data.token) {
                await storeToken(response.data.token, response.data.user.name);
                navigation.replace('Tabs'); // Cambiado a replace para evitar volver atrás
            }*/

            if (response.status === 200 && response.data.token){
                await storeToken(response.data.token, response.data.user.id, response.data.user.name,response.data.user.email, response.data.user.carnet);
                navigation.replace('Tabs');
            }
        } catch (error) {
            alert(error)
            //setErrors([error.response.data.message]);
            //console.error(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    navigation.replace('Tabs'); // Cambiado a replace para evitar volver atrás
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        checkToken();
    }, []);

    const storeToken = async (token,  userId, userName,userEmail, userCarnet) => {
        try {
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('userid', userId);
            await AsyncStorage.setItem('name', userName);
            await AsyncStorage.setItem('correo', userEmail);
            await AsyncStorage.setItem('carnet', userCarnet);
        } catch (error) {
            console.log('Error saving token:', error);
        }
    };

    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="light" />
            <Image className="h-full w-full absolute" source={require('./../assets/images/bg-login.jpg')} />

            <View className="h-full w-full flex justify-around pt-40 pb-10">
                <View className="flex items-center">
                    <Animated.Text
                        entering={FadeInUp.delay(300).duration(800).springify().damping(3)}
                        className="text-green-800 font-bold tracking-wider text-5xl"
                    >
                        Bienvenido
                    </Animated.Text>
                </View>

                <View className="flex items-center mx-4 space-y-4">
                    <Animated.View
                        entering={FadeInDown.duration(1000).springify()}
                        className="bg-white/60 p-5 rounded-2xl w-full shadow-xl"
                    >
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={'gray'}
                            value={Email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setErrors([]);
                            }}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-white/60 p-5 rounded-2xl w-full mb-3  shadow-xl"
                    >
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={'gray'}
                            value={Password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setErrors([]);
                            }}
                            secureTextEntry
                        />
                    </Animated.View>

                    {Errors.length > 0 && (
                        <Animated.View
                            entering={FadeInDown.delay(100).duration(1000).springify()}
                            className="w-full flex items-center"
                        >
                            {Errors.map((error, index) => (
                                <Text key={index} className="text-red-500 font-bold text-lg">
                                    {error}
                                </Text>
                            ))}
                        </Animated.View>
                    )}
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}
                        className="w-full"
                    >
                        <TouchableOpacity
                            className={`w-full bg-green-600 p-3 rounded-2xl mb-3 ${loading && 'bg-gray-400 disabled:cursor-not-allowed'}`}
                            onPress={handleLogin}
                        >
                            <Text className="text-xl font-bold text-white text-center">
                                {!loading ? 'Acceder' : 'Cargando...'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(600).duration(1000).springify()}
                        className="flex-row justify-center"
                    >
                        <Text className="text-black">¿No tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.push('ElibRegister')}>
                            <Text className="text-green-600">Registrate</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}
