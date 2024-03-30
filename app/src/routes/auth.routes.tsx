import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Image, TouchableOpacity, View } from "react-native";
import HomeLogout from "../pages/HomeLogout";
import InfoPetLogout from "../pages/InfoPetLogout";
import { Pet } from "../lib/pet";

export type StackParamsList = {
    HomeLogout: {},
    InfoPetLogout: { pet: Pet; isLogged: boolean; isMyPet: boolean };
    Login: {},
    Logout: {},
    Register: {}
};

const Stack = createNativeStackNavigator<StackParamsList>();

function AuthRoutes() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeLogout"
                component={HomeLogout}
                options={({ navigation }) => ({
                    title: "Audote-me",
                    headerStyle: {
                        backgroundColor: "rgba(255,133,133,28)"
                    },
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontSize: 24,
                        fontWeight: "bold",
                    },
                    headerTintColor: "#363636",
                    headerRight: () => (
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Image
                                    source={require("../assets/ic_login.png")}
                                    style={{ height: 30, width: 30 }}
                                />
                            </TouchableOpacity>
                        </View>
                    ),
                })}
            />
            <Stack.Screen
                name="InfoPetLogout"
                component={InfoPetLogout}
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
                name="Login"
                component={Login}
                options={{
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
                name="Register"
                component={Register}
                options={{
                    title: "Cadastro",
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

export default AuthRoutes;
