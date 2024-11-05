import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ElibRegister() {
    const navigation = useNavigation();

    // Estados para almacenar los valores del formulario
    const [Name, setName] = useState('');
    const [Carnet, setCarnet] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [RepeatPassword, setRepeatPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Función para manejar el registro
    const handleRegister = async () => {
        if (!Name || !Carnet || !Email || !Password || !RepeatPassword) {
            alert('Llena todos los campos');
            return;
        }

        if (Password !== RepeatPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        try {
            // Enviar la solicitud POST al backend
            const response = await axios.post(`${SERVER_URL}api/register`, {
                name: Name,
                carnet: Carnet,
                email: Email,
                password: Password,
            });

            // Manejar la respuesta exitosa
            if (response.status === 201) {
                alert('Registro exitoso');
                storeUser(response.data.user)
                navigation.push('ElibLogin')
            }
        } catch (error) {
            // Manejar los errores
            if (error.response) {
                console.log('Error en la respuesta del servidor:', error.response.data);
                alert(error.response.data.message || 'Error en el registro');
            } else {
                console.error('Error en la solicitud:', error.message);
                alert('Error en el registro. Inténtalo de nuevo.');
            }
        }
        setLoading(false);
    };

    const storeUser = async (user) => {
        try {
            await AsyncStorage.setItem('username', user.name);
            await AsyncStorage.setItem('email', user.email);
        } catch (error) {
            console.log('Error saving token:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="bg-white h-full w-full">
                    <StatusBar style="light" />
                    {/* Background */}
                    <Image className="h-full w-full absolute" source={require('./../assets/images/bg-login.jpg')} />

                    {/* Title and form */}
                    <View className="h-full w-full flex justify-around pt-40 pb-10">
                        {/* Title */}
                        <View className="flex items-center">
                            <Animated.Text entering={FadeInUp.delay(300).duration(800).springify().damping(3)} className="text-green-800 font-bold tracking-wider text-5xl text-center">
                                Creando cuenta
                            </Animated.Text>
                        </View>

                        {/* Form */}
                        <View className="flex items-center mx-4 space-y-4">
                            <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-white/70 p-5 rounded-2xl w-full shadow-xl">
                                <TextInput placeholder="Nombres" placeholderTextColor="gray" value={Name} onChangeText={setName} />
                            </Animated.View>
                            <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-white/70 p-5 rounded-2xl w-full shadow-xl">
                                <TextInput placeholder="Carnet" placeholderTextColor="gray" value={Carnet} onChangeText={setCarnet} />
                            </Animated.View>
                            <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-white/70 p-5 rounded-2xl w-full shadow-xl">
                                <TextInput placeholder="Email" placeholderTextColor="gray" value={Email} onChangeText={setEmail} />
                            </Animated.View>
                            <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-white/70 p-5 rounded-2xl w-full shadow-xl">
                                <TextInput placeholder="Contraseña" placeholderTextColor="gray" value={Password} onChangeText={setPassword} secureTextEntry />
                            </Animated.View>
                            <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-white/70 p-5 rounded-2xl w-full mb-3 shadow-xl">
                                <TextInput placeholder="Repite la contraseña" placeholderTextColor="gray" value={RepeatPassword} onChangeText={setRepeatPassword} secureTextEntry />
                            </Animated.View>
                            <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="w-full">
                                <TouchableOpacity className={`w-full bg-green-600 p-3 rounded-2xl mb-3 ${loading && 'bg-gray-400 disabled:cursor-not-allowed'}`} disabled={loading} onPress={handleRegister}>
                                    <Text className="text-xl font-bold text-white text-center">{!loading ? 'Continuar' : 'Cargando...'}</Text>
                                </TouchableOpacity>
                            </Animated.View>

                            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                                <Text className="text-black">¿Ya posees una cuenta? </Text>
                                <TouchableOpacity onPress={() => navigation.push('ElibLogin')}>
                                    <Text className="text-green-600">Acceder</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
