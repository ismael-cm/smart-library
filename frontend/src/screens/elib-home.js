import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

export default function ElibHome() {
  const [books, setBooks] = useState([
    {
      image: require("./../assets/images/bookbg.png"),
      name: "Girl",
      description: "Edna O'Brien",
      id: "1",
    },
    {
      image: require("./../assets/images/bookbg.png"),
      name: "Hamnet",
      description: "Maggie O'Farrel",
      id: "2",
    },
    {
      image: require("./../assets/images/bookbg.png"),
      name: "The Dutch",
      description: "Ann Patchett",
      id: "3",
    },
  ]);

  const handelBookPress = (item) => {
    alert(`Presionaste el libro con nombre: ${item.name}`);
  };

  const renderArrivals = ({ item }) => (
    <View className="w-36 h-full p-6 pr-1 pt-0 pb-0 relative">
      <View className="rounded-xl h-40 w-full shadow-xl">
        <Image className="rounded-xl h-40 w-full" source={item.image} />
      </View>
      <View className="p-2 pt-0">
        <Text className="my-2">{item.name}</Text>
        <Text className="font-thin text-sm">{item.description}</Text>
      </View>

      <TouchableOpacity
        className="ml-4 w-[115%] h-full absolute"
        onPress={() => handelBookPress(item)}
      ></TouchableOpacity>
    </View>
  );

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="dark" />
      <ScrollView className="bg-gray-100 h-full w-full pl-8 pr-8">
        <View className="flex flex-row items-end w-full h-48">
          <View className="w-fit mb-6">
            <Text className="text-green-400 text-lg font-semibold w-32">
              Good Afternoon,
            </Text>
            <Text className="text-black font-semibold text-xl">
              Gustavo Gomez
            </Text>
          </View>

          <View className="flex w-36 h-36 ml-8 items-end justify-end">
            <Image
              className="w-full h-full"
              source={require("./../assets/images/reading.png")}
            />
          </View>
        </View>
        <View className="flex flex-row bg-white space-x-6 w-full h-fit p-4 rounded-2xl shadow-md">
          <Image
            className="h-6 w-6  placeholder-gray-500"
            source={require("./../assets/images/icons/search.png")}
          />
          <TextInput
            className=" "
            placeholder="Search for Books..."
            placeholderTextColor="#9CA3AF"
          ></TextInput>
        </View>
        <View className="h-fit w-full my-6">
          <View className="flex flex-row items-center">
            <Text className="font-semibold text-xl">New Arrivals</Text>
            <TouchableOpacity className="absolute right-0">
              <Text className="text-orange-600">View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={books}
            renderItem={renderArrivals}
            keyExtractor={(item) => item.id}
            className="w-[120%] h-54 mt-4 -left-8"
            horizontal={true}
          />
        </View>
        <View className="w-full h-32 rounded-2xl">
          <Text className="font-semibold text-xl">Best Ever Book Lists</Text>
          <View className="w-full h-32 bg-white top-2 rounded-2xl shadow-xl">
            <Image
              className="rounded-xl h-full w-full"
              source={require("./../assets/images/bestbooks.png")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
