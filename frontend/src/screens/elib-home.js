import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Asegúrate de tener axios instalado
import { SERVER_URL } from '@env';
import { getDefaultImage } from '../components/defaultImages'


export default function ElibHome({ navigation }) {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [genres, setGenres] = useState('');
    const [imageError, setImageError] = useState(false);
    useEffect(() => {
        // Función para obtener los datos almacenados
        const loadData = async () => {
            try {
                const storedName = await AsyncStorage.getItem('username');
                const storedToken = await AsyncStorage.getItem('authToken');

                if (storedName) {
                    setName(storedName);
                }

                if (storedToken) {
                    setToken(storedToken); // Usar useState para actualizar el token
                    fetchBooksByGenres(storedToken, '672994cf811472689b543cb6'); // Llamar a la función para obtener libros
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        loadData();
    }, []);

    // Función para obtener libros desde el backend por género
    const fetchBooksByGenres = async (authToken, genreId) => {
        try {
            const response = await axios.get(`${SERVER_URL}api/books/genre`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setGenres(response.data);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        }
    };

    const fetchGenres = async (authToken) => {
        try {
            const response = await axios.get(`${SERVER_URL}api/genres?limit=3`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setGenres(response.data);
        } catch (error) {
            console.error('Error al obtener los generos:', error);
        }
    };



    const renderArrivals = ({ item }) => (
        <View className="w-36 h-full p-6 pr-1 pt-0 pb-0 relative">
            <View className="rounded-xl h-40 w-full shadow-xl">
            <Image
                  className="rounded-xl h-40 w-full"
                  source={imageError ? getDefaultImage() : { uri: item.image }}
                  onError={() => setImageError(true)}
              />
            </View>
            <View className="p-2 pt-0">
                <Text className="my-2">{item.title}</Text>
                {/* <Text className="font-thin text-sm">{item.description}</Text> */}
            </View>
            <TouchableOpacity
                className="ml-4 w-[115%] h-full absolute"
                onPress={() => navigation.navigate('ElibBook', { book: item })}
            ></TouchableOpacity>
        </View>
    );

    return (
        <View className="bg-white flex-1 w-full">
            <StatusBar style="dark" />
            <ScrollView 
                className="bg-gray-100 h-full w-full pl-8 pr-8"
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                <View className="flex flex-row items-end w-full h-48">
                    <View className="w-fit mb-6">
                        <Text className="text-green-400 text-lg font-semibold w-32">
                            Good Afternoon, 
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
                <View className="flex flex-row bg-white space-x-6 w-full h-fit p-4 rounded-2xl shadow-md">
                    <Image
                        onPress={() => navigation.navigate('ElibSearch')}
                        className="h-6 w-6 placeholder-gray-500"
                        source={require('./../assets/images/icons/search.png')}
                    />
                    <TextInput
                        onPress={() => navigation.navigate('ElibSearch')}
                        className=""
                        placeholder="Search for Books..."
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                <View className="h-fit w-full my-6">
                    
                {genres.length > 0 && (
                    genres.map((genre, index) => (
                        <View key={index}>
                        <View className="flex flex-row items-center">
                            <Text className="font-semibold text-xl">{genre.genre.description}</Text>
                            <TouchableOpacity className="absolute right-0">
                            <Text className="text-orange-600">Ver todo</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={genre.books}
                            renderItem={renderArrivals}
                            keyExtractor={(item) => item._id}
                            className=" h-54 mt-1 -left-7 w-[100%]"
                            horizontal
                            contentContainerStyle={{ paddingHorizontal: 5 }}
                        />
                        </View>
                    ))
                    )}

                    
                </View>
                <View className="w-full h-32 rounded-2xl">
                    <Text className="font-semibold text-xl">Explora nuevos libros</Text>
                    <View className="w-full h-32 bg-white top-2 rounded-2xl shadow-xl">
                        <Image
                            className="rounded-xl h-full w-full"
                            source={require('./../assets/images/bestbooks.png')}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
