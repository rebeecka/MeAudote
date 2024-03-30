import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import api from "../../services/api";
import { User } from "../../lib/user";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../../lib/constants";
import { Registro } from "../../lib/user";
import { AuthContext } from "../../contexts/AuthContext";

export default function Edit() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [picture, setPicture] = useState<string | null>("");
  const [base64, setBase64] = useState<string | null>(null);
  const { accessToken } = useContext(AuthContext);

  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  useEffect(() => {
    getProfile();
  }, []);

  async function edit() {
    let newPassword = null;

    if (password != null || password != "") {
      newPassword = password;
    }

    const novoRegistro: Registro = {
      name: name,
      image: base64!!,
      email: email,
      phone: phone,
      password: newPassword!!,
    };

    api
      .put("/users/me", novoRegistro, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          Alert.alert("Perfil alterado com sucesso!");
          navigation.goBack();
        }
      })
      .catch((error) => {
        Alert.alert(error.response?.data?.message)
      });
  }

  async function selectFile() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        setPicture(null);
        setSelectedImageUri(result.assets!![0].uri);
        setBase64(result.assets!![0].base64!!);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem");
    }
  }

  async function getProfile() {
    const url = `/users/me`;
    const accessToken = await SecureStore.getItemAsync("accessToken");
    api
      .get<User>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const result: User = response.data;
          setEmail(result.email);
          setPhone(result.phone);
          setName(result.name);

          if (result?.image != null) {
            const picture = `${API_URL}files/${result?.image}`;
            setPicture(picture);
          }
        }
      })
      .catch((error) => {
        Alert.alert(error.response?.data?.message)
      });
  }
  const deleteUser = async () => {
    try {
      const confirmDeletion = await new Promise((resolve) =>
        Alert.alert(
          'Confirmação',
          'Tem certeza que deseja excluir seu usuário?',
          [
            { text: 'Cancelar', onPress: () => resolve(false) },
            { text: 'Confirmar', onPress: () => resolve(true) },
          ],
          { cancelable: false }
        )
      );

      if (confirmDeletion) {
        const response = await api.delete('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          Alert.alert('Usuário excluído com sucesso!');
        
        }
      }
    } catch (error) {
      console.error('Erro ao excluir usuário', error);
      Alert.alert('Erro ao excluir usuário', 'Ocorreu um erro ao excluir o usuário. Por favor, tente novamente.');
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectFile} style={styles.buttonImg}>
        {picture ? (
          <Image style={styles.img} source={{ uri: picture }} />
        ) : selectedImageUri ? (
          <Image style={styles.img} source={{ uri: selectedImageUri }} />
        ) : (
          <Image
            style={styles.img}
            source={require("../../assets/avatar.jpg")}
          />
        )}
      </TouchableOpacity>
      <View style={styles.containerInputText}>
        <TextInput
          placeholder="Nome Completo"
          placeholderTextColor="black"
          style={styles.inputText}
          value={name}
          inputMode="text"
          onChangeText={setName}
        />
        <TextInput
          placeholder="Telefone"
          placeholderTextColor="black"
          style={styles.inputText}
          inputMode="tel"
          // keyboardType={'phone-pad'}
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="black"
          style={styles.inputText}
          value={email}
          inputMode="email"
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="black"
          style={styles.inputText}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          !(name && phone && email) && { backgroundColor: "#ccc" },
        ]}
        onPress={edit}
      >
        <Text style={styles.buttonText}>EDITAR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: 'red' }, 
        ]}
        onPress={deleteUser}
      >
        <Text style={styles.buttonText}>EXCLUIR USUÁRIO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffc0cb",
   
  
  },
  containerInputText: {
    width: "95%",
    marginVertical: 10,
    height:"35%",
  },
  inputText: {
    height: 50,
    fontSize: 18,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#6C7B8B",
    marginBottom: 12,
  },
  button: {
    width: "95%",
    height: 60,
    backgroundColor: "#FB3D41",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginBottom: 12,
   
   
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonImg: {
    marginVertical: 50,
    
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
  },
});
