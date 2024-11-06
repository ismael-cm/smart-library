import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ElibLoanManagement() {


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

     

            </View>
        </ScrollView>
    );
}
