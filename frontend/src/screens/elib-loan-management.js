import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ElibLoanManagement() {
    const navigation = useNavigation();
    const [bookName, setBookName] = useState('');
    const [loanDate, setLoanDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loans, setLoans] = useState([]);

    // Cargar los datos de AsyncStorage al montar el componente
    useEffect(() => {
        loadLoans();
    }, []);

    // Guardar el préstamo en AsyncStorage
    const saveLoan = async () => {
        try {
            const newLoan = { bookName, loanDate, dueDate };
            const updatedLoans = [...loans, newLoan];
            setLoans(updatedLoans);
            await AsyncStorage.setItem('loans', JSON.stringify(updatedLoans));
            clearInputs();
            alert('Préstamo guardado exitosamente');
        } catch (error) {
            console.log(error);
            alert('Error al guardar el préstamo');
        }
    };

    // Cargar los préstamos desde AsyncStorage
    const loadLoans = async () => {
        try {
            const savedLoans = await AsyncStorage.getItem('loans');
            if (savedLoans !== null) {
                setLoans(JSON.parse(savedLoans));
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Limpiar los inputs después de guardar
    const clearInputs = () => {
        setBookName('');
        setLoanDate('');
        setDueDate('');
    };

    // Renovar un préstamo (extender la fecha de vencimiento)
    const renewLoan = (index) => {
        Alert.prompt(
            'Renovar préstamo',
            'Ingresa la nueva fecha de vencimiento (YYYY-MM-DD):',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Renovar',
                    onPress: (newDueDate) => {
                        const updatedLoans = [...loans];
                        updatedLoans[index].dueDate = newDueDate;
                        setLoans(updatedLoans);
                        AsyncStorage.setItem('loans', JSON.stringify(updatedLoans));
                        alert('Préstamo renovado');
                    },
                },
            ],
        );
    };

    // Eliminar un préstamo del historial
    const removeLoan = (index) => {
        Alert.alert('Eliminar préstamo', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                onPress: async () => {
                    const updatedLoans = loans.filter((_, i) => i !== index);
                    setLoans(updatedLoans);
                    await AsyncStorage.setItem('loans', JSON.stringify(updatedLoans));
                },
            },
        ]);
    };

    return (
        <ScrollView className="bg-white h-full w-full mb-24 pb-8">
            <StatusBar style="dark" />
            <View className="bg-white w-full h-full">
                {/* Header con imagen */}
                <View className="flex flex-row h-60 w-full shadow-xl justify-end items-end">
                    <View className="w-1/3 h-32 justify-center items-center">
                        <Text className="text-xl font-semibold">10</Text>
                        <Text className="text-xs font-thin">Préstamos Actuales</Text>
                    </View>
                    <View className="w-1/3 h-32 justify-center items-center">
                        <View className="w-28 h-28 rounded-full bg-white shadow-lg">
                            <Image className="rounded-full h-full w-full" source={require('./../assets/images/profile.jpg')} />
                        </View>
                    </View>
                    <View className="w-1/3 h-32 justify-center items-center">
                        <Text className="text-xl font-semibold">5</Text>
                        <Text className="text-xs font-thin">Reservas Activas</Text>
                    </View>
                </View>

                {/* Inputs para añadir préstamos */}
                <View className="w-full p-4">
                    <Text className="text-xl font-semibold mb-4">Añadir Préstamo</Text>
                    <TextInput
                        placeholder="Nombre del libro"
                        value={bookName}
                        onChangeText={setBookName}
                        className="bg-gray-100 p-3 rounded-xl mb-4"
                    />
                    <TextInput
                        placeholder="Fecha de préstamo (YYYY-MM-DD)"
                        value={loanDate}
                        onChangeText={setLoanDate}
                        className="bg-gray-100 p-3 rounded-xl mb-4"
                    />
                    <TextInput
                        placeholder="Fecha de vencimiento (YYYY-MM-DD)"
                        value={dueDate}
                        onChangeText={setDueDate}
                        className="bg-gray-100 p-3 rounded-xl mb-4"
                    />
                    <TouchableOpacity
                        onPress={saveLoan}
                        className="bg-green-500 p-3 rounded-xl mb-4"
                    >
                        <Text className="text-white text-center">Añadir Préstamo</Text>
                    </TouchableOpacity>
                </View>

                {/* Lista de préstamos actuales */}
                <View className="h-full w-full p-6">
                    <Text className="font-semibold text-lg mb-4">Préstamos Actuales</Text>
                    <FlatList
                        data={loans}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View className="bg-white p-4 rounded-xl mb-4 shadow">
                                <Text className="text-lg font-semibold">{item.bookName}</Text>
                                <Text className="text-sm text-gray-600">
                                    Fecha de préstamo: {item.loanDate}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    Fecha de vencimiento: {item.dueDate}
                                </Text>
                                <View className="flex-row mt-4">
                                    <TouchableOpacity
                                        onPress={() => renewLoan(index)}
                                        className="bg-orange-500 p-2 rounded-lg mr-2"
                                    >
                                        <Text className="text-white">Renovar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => removeLoan(index)}
                                        className="bg-red-500 p-2 rounded-lg"
                                    >
                                        <Text className="text-white">Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        style={{ maxHeight: 400 }} // Ajustar la altura máxima de la lista
                    />
                </View>
            </View>
        </ScrollView>
    );
}
