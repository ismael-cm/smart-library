import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { SERVER_URL } from '@env';
import moment from 'moment';

export default function ElibHome({ navigation }) {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedName = await AsyncStorage.getItem('username');
                const storedToken = await AsyncStorage.getItem('authToken');
                if (storedName) setName(storedName);
                if (storedToken) {
                    setToken(storedToken);
                    fetchPendingLoans(storedToken);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
        loadData();
    }, []);

    const fetchPendingLoans = async (authToken) => {
        try {
            const response = await axios.get(`${SERVER_URL}api/loans/getPendingLoans`, {
                headers: { Authorization: `Bearer ${authToken}` },
            }); 
            setLoans(response.data.loans);
            console.log("Se recargó"); 
            //console.log(response.data.loans);
        } catch (error) {
            console.error('Error al obtener préstamos pendientes:', error);
        }
    };

    const confirmReturnBook = (loanId) => {
        Alert.alert(
            "Confirmar devolución",
            "¿Está seguro de que desea devolver este libro?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Devolver", onPress: () => handleReturnBook(loanId) },
            ]
        );
    };

    const handleReturnBook = async (loanId) => {
        try {
            console.log("TOKEN: " + token);
            // Adaptando la URL para usar el loanId directamente en la URL
            const response = await axios.patch(
                `${SERVER_URL}api/loans/return/${loanId}`,  // El loanId se pasa en la URL
                {}, // No es necesario pasar un cuerpo de solicitud
                { headers: { Authorization: `Bearer ${token}` } } 
            );
    
            if (response.data.success) {
                Alert.alert("Éxito", "El libro ha sido devuelto.");
                fetchPendingLoans(token); // Actualiza los préstamos pendientes
            } else {
                Alert.alert("Error", "No se pudo devolver el libro.");
            }
        } catch (error) {
            console.error('Error al devolver el libro:', error);
            const errorMessage = error.response?.data?.message || 'No se pudo devolver el libro.';
            Alert.alert("Error", errorMessage); // Muestra el mensaje de error detallado
        }
    };
    

    const renderLoanItem = ({ item }) => {
        const formattedDate = moment(item.loan_date).format('DD/MM/YYYY');

        return(
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            marginVertical: 5,
            borderRadius: 8,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 6,
            elevation: 2,
        }}>
            <View style={{ marginRight: 10 }}>
                {item.book_id.image ? (
                    <Image
                        source={{ uri: item.book_id.image }}  // Asumiendo que la imagen está en una URL
                        style={{ width: 60, height: 90, borderRadius: 5 }}
                    />
                ) : (
                    <Text>No Imagen</Text> // Si no hay imagen, muestra texto o un placeholder
                )}
            </View>
    
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.book_id.title}</Text>
                <Text style={{ color: 'gray' }}>Prestado a: {item.user_id.name}</Text>
                <Text style={{ color: 'gray' }}>Fecha de préstamo: {formattedDate}</Text>
            </View>
    
            <TouchableOpacity
                style={{
                    backgroundColor: '#2bba52',
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                }}
                onPress={() => confirmReturnBook(item._id)}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Devolver</Text>
            </TouchableOpacity>
        </View>
        )
    };
    
 
    return (
        <View className="bg-white flex-1 w-full">
            <StatusBar style="dark" />
            <FlatList
                ListHeaderComponent={
                    <View style={{ padding: 16 }}>
                        <View className="flex flex-row items-end w-full h-48 mb-6">
                            <View className="w-fit">
                                <Text className="text-green-400 text-lg font-semibold w-32">
                                    Bienvenido, 
                                </Text>
                                <Text className="text-black font-semibold text-xl">
                                    {name}
                                </Text>
                            </View>
                            <View className="flex w-36 h-36 ml-8 items-end justify-end">
                                <Image
                                    className="w-full h-full"
                                    source={require('./../assets/images/reading.png')}
                                />
                            </View>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                            Préstamos Pendientes
                        </Text>
                    </View>
                }
                data={loans}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderLoanItem}
                ListEmptyComponent={() => (
                    <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>
                        No hay préstamos pendientes.
                    </Text>
                )}
                contentContainerStyle={{ paddingBottom: 150 }}
            />
        </View>
    );
}
