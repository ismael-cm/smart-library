import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import { SERVER_URL } from '@env';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { getDefaultImage } from '../components/defaultImages';
import axios from 'axios';


export default function ElibBook({ navigation, route }) {
    const { book } = route.params;
    const [user, setUser] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputLoanDays, setInputLoanDays] = useState('15');
    const [isLoading, setIsLoading] = useState({})
    const [isSaving, setIsSaving] = useState({})
    const isAbailable = book.available_stock > 0
    const [storedToken, setStoredToken] = useState(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                setStoredToken(await AsyncStorage.getItem('authToken'))
                // Aquí puedes usar storedToken si es necesario
                const response = await axios.get(`${SERVER_URL}api/profile`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });

                if(response.status === 200)
                    setUser(response.data.user)

                console.log(user)
                console.log(book)
            } catch (error) {
                alert(error.response.data.messag)
                console.error('Error al obtener los datos:', error);
            }
        };

        loadData();
    }, []);

    const handleButtonPress = () => {
        if (isAbailable) {
          setIsModalVisible(true);
        }
    };

    const handleConfirmLoan = async () => {
        const days = parseInt(inputLoanDays);
      
        if (isNaN(days) || days <= 0 || days > 20) {
          Alert.alert(`Entrada inválida (${days} días)`, 'Por favor ingresa un número de días válido. Menor a 20 días y mayor que 0 días');
          return;
        }
      
        setIsModalVisible(false);
        await lendBook(days);
    };
      

    const lendBook = async (days) => {
        setIsSaving(true)
        console.log('api/loans/create', storedToken)
        try {
            const response = await axios.post(
                `${SERVER_URL}api/loans/create`,
                {
                  userId: user._id,
                  bookId: book._id,
                  days: days,
                },
                {
                  headers: { Authorization: `Bearer ${storedToken}` },
                }
              );
              
            if(response.status === 200) 
                alert('Préstamo guardado exitosamente');
        } catch (error) {
            alert(error.response.data.message);
        }

        setIsSaving(false)
        
    }

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <StatusBar style="dark" />

            {/* Encabezado */}
            <View className="flex-row items-center justify-end p-4 mt-10">
                <Icon onPress={() => navigation.goBack()} name="close" size={30} color="black" />
            </View>

            <View className="flex-row items-center justify-center px-4">
                <Text className="text-2xl font-bold text-gray-800">{book.title}</Text>
            </View>


            {/* Imagen del libro */}
            <View className="items-center mt-6">
                <Image
                    className="w-40 h-60 rounded-lg shadow-lg"
                    source={
                        book.image
                            ? { uri: book.image }
                            : getDefaultImage()
                    }
                />
            </View>

            
            <View className="bg-white mt-4 rounded-2xl p-4 mx-5 shadow-md">
                <Text className="text-lg text-gray-600 mt-1">Por {book.author}</Text>

                {/* Información adicional */}
                <View className="mt-4">
                    <Text className="text-base text-gray-700">
                        <Text className="font-semibold">Género: {book.genre}</Text> 
                    </Text>
                    <Text className="text-base text-gray-700 mt-1">
                        <Text className="font-semibold">ISBN: {book.isbn}</Text> 
                    </Text>
                    <Text className="text-base text-gray-700 mt-1">
                        <Text className="font-semibold">Disponibles: {book.available_stock}</Text> 
                    </Text>
                </View>

                {/* Descripción */}
                <View className="mt-6">
                    <Text className="text-lg font-semibold text-gray-800">Descripción</Text>
                    <Text className="text-base text-gray-700 mt-2 text-justify">{book.description}</Text>
                </View>

                {!isAbailable && (
                    <View className="bg-yellow-400 p-4 rounded-lg my-4 flex-row items-center ">
                        <Icon name="error" size={24} color="white" style={{ marginRight: 8 }} />
                        <Text className="text-white font-bold text-center">
                            No hay libros con esos criterios
                        </Text>
                    </View>
                )
                
                }
                {/* Botón de acción */}
                <TouchableOpacity onPress={() => handleButtonPress()} className="bg-green-500 p-3 rounded-lg mt-6">
                    {isAbailable ? 
                        (<Text className="text-white text-center font-semibold">Prestar Libro</Text>) :
                        (<Text className="text-white text-center font-semibold">Reservar Libro</Text>)
                    }
                </TouchableOpacity>   

                
            </View>

            <Modal
            transparent={true}
            animationType="slide"
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white w-3/4 p-6 rounded-2xl shadow-lg">
                <Text className="text-xl font-bold text-center mb-4">Prestar Libro</Text>
                <Text className="text-center mb-4">¿Por cuántos días deseas prestar el libro?</Text>
                
                <TextInput
                    className="border border-gray-300 rounded-md mt-2 px-4 py-2 text-center text-lg"
                    keyboardType="numeric"
                    defaultValue="15"
                    min="1"
                    max="20"
                    onChangeText={(text) => setInputLoanDays(text)}
                />
                
                <View className="flex-row justify-between mt-6">
                    <TouchableOpacity 
                    onPress={() => setIsModalVisible(false)} 
                    className="flex-1 bg-red-500 py-2 rounded-lg mr-2"
                    >
                    <Text className="text-center text-white font-semibold">Cancelar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                    onPress={handleConfirmLoan} 
                    className="flex-1 bg-green-500 py-2 rounded-lg ml-2"
                    >
                    <Text className="text-center text-white font-semibold">Aceptar</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
            </Modal>


        </ScrollView>
    );
}
