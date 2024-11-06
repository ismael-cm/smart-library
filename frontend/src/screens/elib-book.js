import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@env';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { getDefaultImage } from '../components/defaultImages';

export default function ElibBook({ navigation, route }) {
    const { book } = route.params;

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                // Aquí puedes usar storedToken si es necesario
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        loadData();
    }, []);

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

                {/* Botón de acción */}
                <TouchableOpacity className="bg-green-500 p-3 rounded-lg mt-6">
                    <Text className="text-white text-center font-semibold">Reservar Libro</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
