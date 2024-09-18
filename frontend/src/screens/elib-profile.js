import { View, Text, Image, TextInput, TouchableOpacity, TouchableHighlight, ScrollView, FlatList } from 'react-native'
import React,{useState} from 'react'
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import reading from './../assets/images/reading.png';




export default function ElibProfile() {
    const navigation = useNavigation();

    const [books, setBooks] = useState([{
        image: require("./../assets/images/bookbg.png"),
        name: "Girl",
        description: "Edna O'Brien",
        id: '1'
    }, {
        image: require("./../assets/images/bookbg.png"),
        name: "Hamnet",
        description: "Maggie O'Farrel",
        id: '2'
    }, {
        image: require("./../assets/images/bookbg.png"),
        name: "The Dutch",
        description: "Ann Patchett",
        id: '3'
    }]);

    const handelBookPress = (item) =>{
        alert(`Presionaste el libro con nombre: ${item.name}`);
    };

    return (
        <View className="bg-white h-full w-full">
            <StatusBar style='dark' />
            
            
            <View className="bg-whitew-full h-full">
                <Animated.View  entering={FadeInDown.duration(800).springify()} className="flex flex-row h-60 w-full shadow-xl justify-end items-end">
                    <View className="w-1/3 h-32 justify-center items-center">
                        <Text className="text-xl font-semibold">
                            188
                        </Text>
                        <Text className="text-xs font-thin">
                            Followers
                        </Text>
                    </View>
                    <View className="w-1/3 h-32 justify-center items-center">
                        <View className='w-28 h-28 rounded-full bg-white shadow-lg'>
                            <Image  className="rounded-full h-full w-full" source={require('./../assets/images/profile.jpg')} />
                        </View>
                    </View>
                    <View className="flex w-1/3 h-32 justify-center items-center">
                        <Text className="text-xl font-semibold">
                            29
                        </Text>
                        <Text className="text-xs font-thin">
                            Reading
                        </Text>
                    </View>
                </Animated.View>
                <View className="w-full h-20 items-center justify-center">
                    <Text className="text-xl font-semibold mb-1">
                        Fabiana Garcia
                    </Text>
                    <Text className="text-md font-thin">
                        El Salvador
                    </Text>
                </View>
                <View className="w-full h-fit p-2 pr-6 pl-6">
                    <View className="w-full h-32 bg-green-400 rounded-3xl shadow-xl">
                    
                    </View>
                </View>
                <View className="h-fit w-full p-6">
                    <View className="flex flex-row items-center">
                        <Text className='font-semibold text-lg'>
                            Continue Reading...
                        </Text>
                        <TouchableOpacity className="absolute right-0">
                            <Text className="text-orange-600">View All</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="w-full h-fit">
                    <View className="bg-white absolute w-72 h-40 left-20 rounded-2xl shadow-2xl mt-6">
                        <Text className="text-xl font-semibold left-28 mt-4">
                            Girl
                        </Text>
                        <Text className="text-md font-thin left-28 mt-4">
                            Edna O'Brien
                        </Text>
                        <Text className="text-sm font-semibold text-green-500 left-28 mt-6">
                            Last Read 2024-03.30
                        </Text>
                        <View  className="bg-gray-300 left-28 mt-4 w-36 h-2 rounded-xl">
                            <View  className="bg-green-400 left-0 top-0 rounded-xl h-full w-[60%]">

                            </View>
                        </View>
                    </View>
                    <Image className="rounded-xl h-40 w-32 left-12" source={require("./../assets/images/bookbg.png")} />
                    
                </View>
            </View>
        </View>
    );
}