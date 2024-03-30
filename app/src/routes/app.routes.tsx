import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../pages/Home";
import InfoPet from "../pages/InfoPet";
import MyPets from "../pages/MyPets";
import RegisterPet from "../pages/RegisterPet";
import Profile from "../pages/Profile";
import { Pet } from "../lib/pet";
import { Image, TouchableOpacity, View } from "react-native";
import Edit from "../pages/Edit";
import { ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../contexts/AuthContext";

export type StackParamsList = {
  Login: {};
  Register: {};
  HomeLogout: {};
  Home: {};
  InfoPet: { pet: Pet; isLogged: boolean; isMyPet: boolean };
  MyPets: {};
  Profile: {};
  RegisterPet: { pet: Pet, edit: boolean };
  Edit: {};
};

const Stack = createNativeStackNavigator<StackParamsList>();

function AppRoutes() {
  const { signOut, imageProfile } = useContext(AuthContext);

  if (!imageProfile) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1D1D2E', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={60} color='#FFF' />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          title: "Audote-me",
          headerStyle: {
            backgroundColor: "rgba(255,133,133,28)",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          headerTintColor: "#363636",
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={() => signOut()}>
                <Image
                  source={require("../assets/ic_logout.png")}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <View>
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Image
                  source={{ uri: imageProfile }}
                  style={{ height: 30, width: 30, borderRadius: 60 }}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="InfoPet"
        component={InfoPet}
        options={{
          title: "Informações",
          headerStyle: {
            backgroundColor: "rgba(255,133,133,28)",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
            
          },
          headerTintColor: "#363636",
        }}
      />
      <Stack.Screen
        name="MyPets"
        component={MyPets}
        options={({ navigation }) => ({
          title: "Meus pets",
          headerStyle: {
            backgroundColor: "rgba(255,133,133,28)",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          headerTintColor: "#363636",
          headerRight: () => (
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterPet", { pet: null, edit: false })}
              >
                <Image
                  source={require("../assets/ic_plus.png")}
                  style={{ height: 30, width: 30, borderRadius: 60 }}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="RegisterPet"
        component={RegisterPet}
        options={{
          title: "Cadastrar pet",
          headerStyle: {
            backgroundColor: "rgba(255,133,133,28)",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          headerTintColor: "#363636",
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "rgba(255,133,133,28)",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          headerTintColor: "#363636",
        }}
      />
      <Stack.Screen
        name="Edit"
        component={Edit}
        options={{
          title: "Editar perfil",
          headerStyle: {
            backgroundColor: "rgba(255,133,133,28)",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          headerTintColor: "#363636",
        }}
      />
    </Stack.Navigator>
  );
}

export default AppRoutes;
