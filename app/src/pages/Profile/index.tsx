import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import * as SecureStore from "expo-secure-store";
import api from "../../services/api";
import { User } from "../../lib/user";
import { API_URL } from '../../lib/constants';
import { AuthContext } from "../../contexts/AuthContext";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const { accessToken, signOut } = useContext(AuthContext);

  const navigationAuth =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  function goToMyPets() {
    navigationAuth.navigate("MyPets", {});
  }

  async function logout() {
    signOut();
  }

  function goToEditProfile() {
    navigationAuth.navigate("Edit", {});
  }

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const url = `/users/me`;
    
    api
      .get<User>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const result: User = response?.data;
          setUser(result);
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        if (error.response)
          Alert.alert(error.response.data?.message)
        else
          Alert.alert('Erro ao buscar os dados');
        setUser(null);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.container2}>

        {user?.image ? (
          <Image
            style={styles.image}
            source={{
              uri: `${API_URL}files/${user?.image}`,
            }}
          />
        ) : (
          <Image
            style={styles.image}
            source={require("../../assets/avatar.jpg")}
          />
        )}

        {/* <Image  source={{uri: 'asset:/avatar.png'}} /> */}
        <Text style={styles.label}>{user?.name}</Text>
      </View>

      <View style={[styles.containerOptions]}>
        <TouchableOpacity style={[styles.box, { backgroundColor: "rgba(255,133,133,28)" }]}>
          <Text style={styles.label} onPress={goToEditProfile}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToMyPets}
          style={[styles.box, { backgroundColor: "rgba(255,133,133,28)" }]}
        >
          <Text style={styles.label}>Meus pets</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.boxButton]}>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>SAIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffc0cb",
  },
  container2: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "35%",
   
  },
  box: {
    width: "100%",
    height: 50,
    padding: 10,
    
  },
  containerOptions: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inputText: {
    width: "95%",
    height: 40,
    fontSize: 18,
    marginVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#6C7B8B",
  },
  label: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  containerCheckBox: {
    alignItems: "center",
  },
  checkBox: {
    flexDirection: "row",
  },
  selectButton: {
    width: "95%",
    height: 40,
    fontSize: 18,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#6C7B8B",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectButtonText: {
    marginTop: 10,
    fontSize: 18,
    color: "#6C7B8B",
  },
  boxButton: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    width: "50%",
    height: 60,
    backgroundColor: "#FB3D41",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 50,
    marginBottom: 12,
    
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonImg: {
    marginVertical: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
  },
});
