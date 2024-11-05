// src/screens/ElibChat.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import tw from 'twrnc';

export default function ElibChat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const sendMessage = () => {
        if (inputMessage.trim()) {
            setMessages([...messages, { id: messages.length.toString(), text: inputMessage }]);
            setInputMessage('');
        }
    };

    return (
        <View style={tw`flex-1 bg-white p-4 pt-10`}>
            <View style={tw`flex-row items-center mb-4`}>
                <TouchableOpacity>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' }}
                        style={tw`w-10 h-10 rounded-full mr-2 border border-gray-300`}
                    />
                </TouchableOpacity>
                <Text style={tw`text-lg font-semibold`}>Bibliotecario</Text>
            </View>

            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={tw`my-2 p-2 bg-gray-200 rounded-xl`}>
                        <Text style={tw`text-base`}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={item => item.id}
                style={tw`flex-1`}
            />

            <View style={tw`flex-row items-center mt-4`}>
                <TextInput
                    style={tw`flex-1 border border-gray-300 rounded-full p-2 mr-2 mb-24`}
                    placeholder="Escribe un mensaje..."
                    value={inputMessage}
                    onChangeText={setInputMessage}
                />
                <TouchableOpacity 
                    style={tw`bg-green-600 rounded-full px-4 py-2 shadow-md mb-24`} 
                    onPress={sendMessage}
                >
                    <Text style={tw`text-white font-bold text-lg`}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
