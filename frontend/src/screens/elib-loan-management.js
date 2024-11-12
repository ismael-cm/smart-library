import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { useFocusEffect } from '@react-navigation/native';

export default function ElibLoanManagement() {
    const [loans, setLoans] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [token, setToken] = useState('');
    const [activeTab, setActiveTab] = useState('loans');

    // Función para obtener los datos de préstamos y reservas cuando la pantalla está en foco
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                const storedToken = await AsyncStorage.getItem('authToken');
                setToken(storedToken);

                if (storedToken) {
                    fetchLoans(storedToken);
                    fetchReservations(storedToken);
                }
            };
            fetchData();
        }, [])
    );

    const fetchLoans = async (authToken) => {
        try {
            const response = await axios.get(`${SERVER_URL}api/loans/user`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setLoans(response.data);
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    const calculateDaysLeft = (returnDate) => {
        const currentDate = new Date();
        const endDate = new Date(returnDate);
        const timeDifference = endDate - currentDate;
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convertir ms a días

        const color = daysLeft <= 2 ? 'red' : 'gray';
        return { daysLeft, color };
    };

    const fetchReservations = async (authToken) => {
        try {
            const response = await axios.get(`${SERVER_URL}api/reservations/user`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const renderLoanItem = ({ item }) => {

        const { daysLeft, color } = calculateDaysLeft(item.return_date);
        
        return (
        
        <TouchableOpacity
            style={{ backgroundColor: 'white', padding: 16, borderRadius: 10, shadowOpacity: 0.2, marginBottom: 10 }}
            onPress={() => Alert.alert('Loan Details', `Loan ID: ${item._id}`)}
        >
            <Image source={{ uri: item.book_id.image }} style={{ width: 100, height: 150, borderRadius: 8 }} />
            <Text style={{ fontWeight: 'bold', marginTop: 8 }}>{item.book_id.title}</Text>
            <Text style={{ color: 'gray' }}>{item.book_id.description}</Text>
            <Text style={{ color: 'gray' }}>Fecha de devolución: {new Date(item.return_date).toLocaleDateString()}</Text>
            <Text style={{ color: item.book_id.available_stock > 0 ? 'green' : 'red' }}>
                Estado: {item.book_id.available_stock > 0 ? 'Disponible' : 'Sin stock'}
            </Text>
            <Text style={{ color: color }}>
                Te quedan: {daysLeft} día{daysLeft !== 1 ? 's' : ''}
            </Text>
        </TouchableOpacity>
    )};

    const renderReservationItem = ({ item }) => {
        const { daysLeft, color } = calculateDaysLeft(item.expiration_date);

        return (
        <TouchableOpacity
            style={{ backgroundColor: 'white', padding: 16, borderRadius: 10, shadowOpacity: 0.2, marginBottom: 10 }}
            onPress={() => Alert.alert('Reservation Details', `Reservation ID: ${item._id}`)}
        >
            <Image source={{ uri: item.book_id.image }} style={{ width: 100, height: 150, borderRadius: 8 }} />
            <Text style={{ fontWeight: 'bold', marginTop: 8 }}>{item.book_id.title}</Text>
            <Text style={{ color: 'gray' }}>{item.book_id.description}</Text>
            <Text style={{ color: 'gray' }}>Expiration Date: {new Date(item.expiration_date).toLocaleDateString()}</Text>
            <Text style={{ color: item.status === 'Pending' ? 'orange' : 'green' }}>
                Estado de la reserva: {item.status}
            </Text>
            <Text style={{ color: item.stock > 0  ? 'green' : 'red' }}>
                 {item.stock > 0 ? 'Disponible para el prestamo' : 'Sin ejemplares disponibles'}
            </Text>
            <Text style={{ color: color }}>
                Expira en: {daysLeft} día{daysLeft !== 1 ? 's' : ''}
            </Text>
        </TouchableOpacity>
    )};

    return (
        <View style={{ backgroundColor: 'white', flex: 1, paddingBottom: 80 }}>
            <StatusBar style="dark" />
            <View style={{ flexDirection: 'row', height: 150, justifyContent: 'space-between', alignItems: 'flex-end', padding: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{loans.length}</Text>
                    <Text style={{ color: 'gray' }}>Préstamos Actuales</Text>
                </View>
                <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={require('./../assets/images/profile.jpg')} />
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{reservations.length}</Text>
                    <Text style={{ color: 'gray' }}>Reservas Activas</Text>
                </View>
            </View>

            {/* Barra de navegación para las tabs */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f1f1f1', paddingVertical: 10 }}>
                <TouchableOpacity onPress={() => setActiveTab('loans')}>
                    <Text style={{ color: activeTab === 'loans' ? '#000' : 'gray', fontWeight: 'bold' }}>Préstamos</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('reservations')}>
                    <Text style={{ color: activeTab === 'reservations' ? '#000' : 'gray', fontWeight: 'bold' }}>Reservaciones</Text>
                </TouchableOpacity>
            </View>

            {/* Lista según la tab seleccionada */}
            {activeTab === 'loans' ? (
                <FlatList
                    data={loans}
                    renderItem={renderLoanItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 16 }}
                />
            ) : (
                <FlatList
                    data={reservations}
                    renderItem={renderReservationItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
        </View>
    );
}
