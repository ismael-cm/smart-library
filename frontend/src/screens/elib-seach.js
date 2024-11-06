import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { Picker } from '@react-native-picker/picker';
import { getDefaultImage } from '../components/defaultImages';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ElibSearch({ navigation }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [token, setToken] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');

    const handleImageError = (isbn) => {
        setBooks((prevBooks) =>
            prevBooks.map((book) =>
                book.isbn === isbn ? { ...book, image: null } : book
            )
        );
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                if (storedToken) {
                    setToken(storedToken);
                    fetchGenres(storedToken);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        loadData();
    }, []);

    const fetchGenres = async (authToken) => {
        try {
            const response = await axios.get(`${SERVER_URL}api/genres`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setGenres(response.data.map((genre) => ({ label: genre.description, value: genre._id })));
        } catch (error) {
            console.error('Error al obtener los géneros:', error);
        }
    };

    const searchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${SERVER_URL}api/books/filter`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    title: searchQuery,
                    genre_id: selectedGenre,
                    author: searchAuthor,
                },
            });
            setBooks(response.data);
        } catch (error) {
            console.error('Error al buscar libros:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearchCriteria = () => {
        setSearchQuery('');
        setSelectedGenre('');
        setSearchAuthor('');
        setBooks([]);
    };

    const renderBookItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ElibBook', { book: item })}
            className="w-36 h-full p-6 pr-1 pt-0 pb-0 relative"
        >
            <View className="rounded-xl h-40 w-full shadow-xl">
                <Image
                    className="rounded-xl h-40 w-full"
                    source={
                        item.image
                            ? { uri: item.image }
                            : getDefaultImage()
                    }
                    onError={() => handleImageError(item.isbn)}
                />
            </View>
            <View className="p-2 pt-0">
                <Text className="my-2 font-semibold">{item.title}</Text>
                <Text className="font-thin text-sm">{item.author}</Text>
            </View>
        </TouchableOpacity>
    );
    

    return (
        <View className="bg-gray-100 flex-1 w-full p-8">
            <StatusBar style="dark" />
            <View className="flex flex-row justify-between mt-4 w-full h-15">
                <View className="w-fit mb-6">
                    <Text className="text-green-400 text-lg font-semibold">
                        Búsqueda de libros
                    </Text>
                </View>
                
                <Icon onPress={() => {navigation.goBack()}} name="close" size={30} color="black"/>
            </View>

            <View className="flex flex-row bg-white space-x-6 w-full h-fit p-4 rounded-2xl shadow-md">
                <Image
                    className="h-6 w-6 placeholder-gray-500"
                    source={require('./../assets/images/icons/search.png')}
                />
                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true}
                    className=""
                    placeholder="Buscar por titulo"
                    placeholderTextColor="#9CA3AF"
                />
            </View>
            <View className="bg-white mt-4 rounded-2xl p-4 shadow-md">
                <Text className="font-semibold mb-2">Buscar por autor:</Text>
                <TextInput
                    value={searchAuthor}
                    onChangeText={setSearchAuthor}
                    className="bg-gray-100 rounded-lg p-2"
                    placeholder="Escribe un autor..."
                    placeholderTextColor="#9CA3AF"
                />
            </View>

            <View className="bg-white mt-4 rounded-2xl p-4 shadow-md">
                <Text className="font-semibold mb-2">Filtrar por género:</Text>
                <View className="rounded-lg bg-gray-100 overflow-hidden">
                    <Picker
                        selectedValue={selectedGenre}
                        onValueChange={(itemValue) => setSelectedGenre(itemValue)}
                        style={{ height: 50, width: '100%', color: '#4b5563' }}
                    >
                        <Picker.Item label="Todos los géneros" value="" />
                        {genres.map((genre) => (
                            <Picker.Item key={genre.value} label={genre.label} value={genre.value} />
                        ))}
                    </Picker>
                </View>
            </View>

            <TouchableOpacity
                onPress={searchBooks}
                className="bg-green-400 mt-4 p-4 rounded-2xl shadow-md"
            >
                <Text className="text-white text-center font-semibold">Buscar</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#00ff00" />}

            {books.length > 0 ? (
                <FlatList
                    data={books}
                    renderItem={renderBookItem}
                    keyExtractor={(item) => item.isbn}
                    className="w-full h-60 mt-6"
                    numColumns={2}
                />
            ) : (
                <View className="bg-red-300 p-4 rounded-lg my-4 flex-row items-center mt-20">
                        <Icon name="error" size={24} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold text-center">
                        No hay libros con esos criterios
                    </Text>
                </View>
            )}
        </View>
    );
}
