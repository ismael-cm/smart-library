import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import { SERVER_URL } from '@env';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { getDefaultImage } from '../components/defaultImages';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import piker from '@react-native-picker/picker'

export default function ElibBook({ navigation, route }) {
    const { bookParam } = route.params;
    const [user, setUser] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputLoanDays, setInputLoanDays] = useState('15');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [storedToken, setStoredToken] = useState('');
    const [book, setBook] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                setStoredToken(token);
                console.log(`Token para busqueda ${token}`);
                await getUser(token);
                await getBook(token);
            } catch (error) {
                alert(error.response?.data?.message || 'Error al obtener los datos');
                console.error('Error al obtener los datos del usuario:', error);
            }
        };
        loadData();
    }, [isSaving]);

    const handleButtonPress = () => {
        if (book && book.isAvailable) {
            setIsModalVisible(true);
        } else {

            Alert.alert(
                'Confirmación', // Título del diálogo
                `¿Estás seguro de que quieres reservar el libro para la fecha ${format(new Date(book.availabilityDate), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}?`, // Mensaje
                [
                    {
                        text: 'Cancelar',
                        onPress: () => {},
                        style: 'cancel',
                    },
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            saveReservation()
                        },
                    },
                ],
                { cancelable: false } // Opcional: evitar cerrar el diálogo al tocar fuera de él
            );
            
        }
    };

    const getUser = async (token) => {
        try {
            const response = await axios.get(`${SERVER_URL}api/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                setUser(response.data.user);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error al obtener los datos del usuario');
            console.error('Error al obtener los datos del usuario:', error);
        }
    };

    const getBook = async (token) => {
        try {
            const response = await axios.get(`${SERVER_URL}api/books/${bookParam._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                console.log(response.data);
                setBook(response.data);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error al obtener los datos del libro');
            console.error('Error al obtener los datos del libro:', error);
        }
    };

    const handleConfirmLoan = async () => {
        const days = parseInt(inputLoanDays);
        if (isNaN(days) || days <= 0 || days > 20) {
            Alert.alert('Entrada inválida', 'Por favor ingresa un número de días válido (1-20).');
            return;
        }
        setIsModalVisible(false);
        await lendBook(days);
    };

    const lendBook = async (days) => {
        setIsSaving(true);
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
            if (response.status === 200) {
                alert('¡Préstamo creado! Pasa a biblioteca a más tardar hoy para recoger el libro');
            }
        } catch (error) {
            alert(error.response?.data?.message || error.response?.data?.error);
        }
        setIsSaving(false);
    };

    const getButtonText = () => {
        if(book.hasAlreadyThisBook ) {
            return {
                message: 'Ya Prestaste este libro',
                class: 'bg-gray-400'
            } 
        } else if(book.reservation) {
            return {
                message: 'Libro reservado',
                class: 'bg-gray-400'
            }
        } 
        else if(book.reservation && book.isAvailable) {
            return {
                message: 'Reservar libro con mi reserva',
                class: 'bg-gray-400'
            }
        } 
        else if (book.isAvailable ) {
            return  {
                message: 'Prestar Libro',
                class: 'bg-green-500'
            }   
        } else {
            return  {
                message: 'Reservar Libro',
                class: 'bg-green-500'
            }   
        }
    }

    const saveReservation = async () => {
        setIsSaving(true);
        try {
            const response = await axios.post(
                `${SERVER_URL}api/reservations/create`,
                {
                    userId: user._id,
                    bookId: book._id,
                },
                {
                    headers: { Authorization: `Bearer ${storedToken}` },
                }
            );
            if (response.status === 200) {
                alert(`¡Reservación creada! Presta el libro el día: ${format(new Date(book.availabilityDate), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}`);
            }
        } catch (error) {
            alert(error.response?.data?.message || error.response?.data?.error);
        }
        setIsSaving(false);
    };

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <StatusBar style="dark" />
            <View className="flex-row items-center justify-end p-4 mt-10">
                <Icon onPress={() => navigation.goBack()} name="close" size={30} color="black" />
            </View>
            {book && (
                <>
                    <View className="flex-row items-center justify-center px-4">
                        <Text className="text-2xl font-bold text-gray-800">{book.title}</Text>
                    </View>
                    <View className="items-center mt-6">
                        <Image
                            className="w-40 h-60 rounded-lg shadow-lg"
                            source={book.image ? { uri: book.image } : getDefaultImage()}
                        />
                    </View>
                    <View className="bg-white mt-4 rounded-2xl p-4 mx-5 shadow-md">
                        <Text className="text-lg text-gray-600 mt-1">Por {book.author}</Text>
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
                        <View className="mt-6">
                            <Text className="text-lg font-semibold text-gray-800">Descripción</Text>
                            <Text className="text-base text-gray-700 mt-2 text-justify">{book.description}</Text>
                        </View>
                        {!book.isAvailable && !book.hasAlreadyThisBook  && !book.reservation && (
                            <View className="bg-yellow-400 p-4 rounded-lg my-4 flex justify-center flex-row items-start p-4 flex-wrap">
                                <Icon name="error" size={24} color="white" style={{ marginRight: 8, alignSelf: 'flex-start' }} />
                                <Text className="text-white font-bold text-left flex-shrink p-1 flex-wrap">
                                    {`No hay ejemplares disponibles, reserva para el ${format(new Date(book.availabilityDate), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}`}
                                </Text>
                            </View>
                        )}  


                        {!book.hasAlreadyThisBook  && book.reservation && (
                            <View className="bg-green-400 p-4 rounded-lg my-4 flex justify-center flex-row items-start p-4 flex-wrap">
                                <Icon name="error" size={24} color="white" style={{ marginRight: 8, alignSelf: 'flex-start' }} />
                                <Text className="text-white font-bold text-left flex-shrink p-1 flex-wrap">
                                    {`Tienes una reservacion para el día ${format(new Date(book.reservation.reservation_date), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}`}
                                </Text>
                                <Text className="text-white font-bold text-left flex-shrink p-1 flex-wrap">
                                    {`Reserva el libria más tardar el día ${format(new Date(book.reservation.expiration_date), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}`}
                                </Text>
                            </View>
                        )}  


                        <TouchableOpacity disabled={book.hasAlreadyThisBook || (book.reservation && !book.isAvailable)} 
                            onPress={handleButtonPress} 
                            className={`${getButtonText().class} p-3 rounded-lg mt-6`}
                        >
                            <Text className="text-white text-center font-semibold">
                                { getButtonText().message }
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {/* modal pra el prestamo */}
            <Modal transparent={true} animationType="slide" visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
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
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} className="flex-1 bg-red-500 py-2 rounded-lg mr-2">
                                <Text className="text-center text-white font-semibold">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirmLoan} className="flex-1 bg-green-500 py-2 rounded-lg ml-2">
                                <Text className="text-center text-white font-semibold">Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
