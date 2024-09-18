import { View, Text, Image, TextInput, TouchableOpacity} from 'react-native'
import React,  { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn,FadeInDown,FadeInUp, FadeOut } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

export default function ElibLogin(){
    const navigation= useNavigation();

    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    
    const handleLogin = () =>{
        console.log("Username: ", Username, "Password: ", Password);
        navigation.push('DProfile');
    }
    return(
        <View className="bg-white h-full w-full">
            <StatusBar style='light'/>
            {/* Background */}
            <Image className="h-full w-full absolute" source={require('./../assets/images/bg-login.jpg')}/>
            
            {/* Title and form */}
            <View className="h-full w-full flex justify-around pt-40 pb-10">
                {/* Title */}
                <View className="flex items-center">
                    <Animated.Text entering={FadeInUp.delay(300).duration(800).springify().damping(3)} className="text-green-800 font-bold tracking-wider text-5xl">
                        Bienvenido
                    </Animated.Text>
                </View>

                {/* Form */}
                <View className="flex items-center mx-4 space-y-4">
                    <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-white/60 p-5 rounded-2xl w-full shadow-xl">
                        <TextInput placeholder='Username' placeholderTextColor={'gray'} value={Username} onChangeText={setUsername}/>
                    </Animated.View>
                    <Animated.View  entering={FadeInDown.delay(200).duration(1000).springify()}  className="bg-white/60 p-5 rounded-2xl w-full mb-3  shadow-xl">
                        <TextInput placeholder='Password' placeholderTextColor={'gray'} value={Password} onChangeText={setPassword} secureTextEntry/>
                    </Animated.View>
                    <Animated.View  entering={FadeInDown.delay(400).duration(1000).springify()} className='w-full'>
                        <TouchableOpacity className="w-full bg-green-600 p-3 rounded-2xl mb-3" onPress={()=> navigation.push('Tabs')}>
                            <Text  className="text-xl font-bold text-white text-center">
                                Login
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View  entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                        <Text className="text-black">Dont have an Account? </Text>
                        <TouchableOpacity onPress={()=> navigation.push('ElibRegister')}>
                            <Text className="text-green-600">SignUP</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}