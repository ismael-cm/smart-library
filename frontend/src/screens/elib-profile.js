import { View, Text, Image, TextInput, TouchableOpacity, Alert, ScrollView, Modal, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { PanGestureHandler, State } from 'react-native-gesture-handler';


export default function ElibProfile({ navigation }) {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [carnet, setCarnet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const showAlert = () => {
        setModalVisible(true);
    };

    const onGestureEvent = (event) => {
        if (event.nativeEvent.translationY > 100) {
          setModalVisible(false);
        }
    };
   
    const handleConfirm = () => {
        updateUserData();
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                console.log(`Token para 22222 ${token}`);
                await getUser(token);
            } catch (error) {
                //alert(error.response?.data?.message || 'Error al obtener los datos');
                console.error('Error al obtener los datos del usuario:', error);
            }
        };
        loadData();
    }, []);

    const getUser = async () => {
        try {
            const nameStored = await AsyncStorage.getItem('name');
            const emailStored = await AsyncStorage.getItem('correo');
            const carnetStored = await AsyncStorage.getItem('carnet');
            var userData = {
                name: nameStored,
                email:emailStored,
                carnet: carnetStored,
                visits: 100,
                readingCount: 4,
                location: "El Salvador"
            }

            setUser(userData);
            setEmail(emailStored)
            setName(nameStored)
            setCarnet(carnetStored)


        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
    };

    const updateUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const userID = await AsyncStorage.getItem('userid');
            const response = await axios.put(`${BASE_URL}api/update/${userID}`, {
                name: name,
                email: email,
                carnet: carnet
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                setEmail(user.email)
                setName(user.name)
                setCarnet(user.carnet)

                var userData = {
                    name: response.data.user.name,
                    email: response.data.user.email,
                    carnet: response.data.user.carnet,
                    visits: 100,
                    readingCount: 4,
                    location: "El Salvador"
                }
                setUser(userData);


                await AsyncStorage.setItem('name', user.name);
                await AsyncStorage.setItem('correo', user.email);
                await AsyncStorage.setItem('carnet', user.carnet);

                alert("Usuario Actualizado")
                setModalVisible(false);
            }
        } catch (error) {
            //alert(error.response?.data?.message || 'Error al obtener los datos del usuario');
            console.error('Error al obtener los datos del usuario:', error);
        }
    };

    const handleLogout = () => {
        AsyncStorage.removeItem('authToken');
        navigation.navigate('ElibLogin');
    }

    return (
        <View className="bg-white h-full w-full">
            <StatusBar style='dark' />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <BlurView 
                intensity={50} 
                className='flex relative bg-black/30 w-full h-full items-center items-around'>
                    <PanGestureHandler onGestureEvent={onGestureEvent}>
                        <View className='flex w-full absolute bg-white/50 h-2/3 mt-2/3 rounded-3xl p-5 shadow-xl bottom-0'>
                            
                            

                            <View  className='w-full p-2 bg-white h-fit p-2 pr-6 pl-6 rounded-2xl '>
                                <Text >
                                    Correo
                                </Text>
                                <View  className='w-full p-2 my-2 bg-gray-100 h-fit p-2 pr-6 pl-6 rounded-2xl '>
                                    <TextInput 
                                        className="flex flex-row align-center justify-center p-3 mb-3"
                                        placeholder="Correo aquí"
                                        value={email}
                                        onChangeText={setEmail}
                                        >
                                    </TextInput>
                                </View>
                                <Text >
                                    Nombre
                                </Text>
                                <View  className='w-full p-2 my-2 bg-gray-100 h-fit p-2 pr-6 pl-6 rounded-2xl '>
                                    <TextInput 
                                        className="flex flex-row align-center justify-center p-3 mb-3"
                                        placeholder="Correo aquí"
                                        value={name}
                                        onChangeText={setName}
                                        >
                                    </TextInput>
                                </View>
                                <Text >
                                    Carnet
                                </Text>
                                <View  className='w-full p-2 my-2 bg-gray-100 h-fit p-2 pr-6 pl-6 rounded-2xl '>
                                    <TextInput 
                                        className="flex flex-row align-center justify-center p-3 mb-3"
                                        placeholder="Correo aquí"
                                        value={carnet}
                                        onChangeText={setCarnet}
                                        >
                                    </TextInput>
                                </View>
                                <View className='w-full p-2 h-fit p-2'>
                                    <TouchableOpacity className="flex flex-row align-center justify-center bg-green-400 p-3 rounded-2xl mb-3" onPress={handleConfirm}>
                                        <Text  className="text-lg font-bold text-white text-center mr-4">
                                            Guardar 
                                        </Text>
                                        {/*<Icon  name="logout" size={30} color="white"/>*/}
                                    </TouchableOpacity>
                                </View>
                                <View className='w-full p-2 h-fit p-2'>
                                    <TouchableOpacity className="flex flex-row align-center justify-center bg-gray-600 p-3 rounded-2xl mb-3" onPress={handleCancel}>
                                        <Text  className="text-lg font-bold text-white text-center mr-4">
                                            Cancelar 
                                        </Text>
                                        {/*<Icon  name="logout" size={30} color="white"/>*/}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </PanGestureHandler>
                </BlurView>
            </Modal>


            <View className="bg-white w-full h-full">
                <Animated.View entering={FadeInDown.duration(800).springify()} className="flex flex-row h-60 w-full shadow-xl justify-end items-end">
                    <View className="w-1/3 h-32 justify-center items-center">
                        <Text className="text-xl font-semibold">
                            {user ? user.visits : 'Loading...'} {/* Ajusta según la propiedad correcta */}
                        </Text>
                        <Text className="text-xs font-thin">
                            Visitas
                        </Text>
                    </View>
                    <View className="w-1/3 h-32 justify-center items-center">
                        <View className='w-28 h-28 rounded-full bg-white shadow-lg'>
                            <Image className="rounded-full h-full w-full" source={require('./../assets/images/profile.jpg')} />
                        </View>
                    </View>
                    <View className="flex w-1/3 h-32 justify-center items-center">
                        <Text className="text-xl font-semibold">
                            {user ? user.readingCount : 'Loading...'} {/* Ajusta según la propiedad correcta */}
                        </Text>
                        <Text className="text-xs font-thin">
                            Reading
                        </Text>
                    </View>
                </Animated.View>
                <View className="w-full h-20 items-center justify-center">
                    <Text className="text-xl font-semibold mb-1">
                        {user ? user.name : 'Loading...'} {/* Ajusta según la propiedad correcta */}
                    </Text>
                    <Text className="text-md font-thin">
                        {user ? user.location : 'Loading...'} {/* Ajusta según la propiedad correcta */}
                    </Text>

                    <Text className="text-md font-thin">
                        {user ? user.email : 'Loading...'} {/* Ajusta según la propiedad correcta */}
                    </Text>

                   

                </View>
                <Animated.View  entering={FadeInDown.delay(400).duration(1000).springify()} className='w-full p-2 h-fit p-2 pr-6 pl-6'>
                    <TouchableOpacity className="flex flex-row align-center justify-center w-fit bg-green-400 p-3 rounded-2xl mb-3" onPress={showAlert}>
                        <Text  className="text-lg font-bold text-white text-center mr-4">
                            Editar Perfil 
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View  entering={FadeInDown.delay(400).duration(1000).springify()} className='w-full p-2 h-fit p-2 pr-6 pl-6'>
                    <TouchableOpacity className="flex flex-row align-center justify-center w-fit bg-red-600 p-3 rounded-2xl mb-3" onPress={handleLogout}>
                        <Text  className="text-lg font-bold text-white text-center mr-4">
                            Cerrar Sesión 
                        </Text>
                        {/*<Icon  name="logout" size={30} color="white"/>*/}
                    </TouchableOpacity>
                </Animated.View>
                <View className="h-fit w-full p-6">
                    <View className="flex flex-row items-center">
                        <Text className='font-semibold text-lg'>
                            Continue Reading...
                        </Text>
                        <TouchableOpacity className="absolute right-0">
                            <Text className="text-orange-600">View All</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="w-full h-fit">
                    <View className="bg-white absolute w-72 h-40 left-20 rounded-2xl shadow-2xl mt-6">
                        <Text className="text-xl font-semibold left-28 mt-4">
                            Girl
                        </Text>
                        <Text className="text-md font-thin left-28 mt-4">
                            Edna O'Brien
                        </Text>
                        <Text className="text-sm font-semibold text-green-500 left-28 mt-6">
                            Last Read 2024-03-30
                        </Text>
                        <View className="bg-gray-300 left-28 mt-4 w-36 h-2 rounded-xl">
                            <View className="bg-green-400 left-0 top-0 rounded-xl h-full w-[60%]">
                            </View>
                        </View>
                    </View>
                    <Image className="rounded-xl h-40 w-32 left-12" source={require("./../assets/images/bookbg.png")} />
                </View>
            </View>
        </View>
    );
}
