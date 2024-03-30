import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { StackParamsList } from "../../routes/app.routes";
import { AuthContext } from "../../contexts/AuthContext";

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const navigationAuth =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function goRegister() {
    navigationAuth.navigate("Register", {});
  }

  function goToHome() {
    if(!email || !password) {
      Alert.alert('Preencha os campos obrigatórios');
    }
    const data = {
      email,
      password
    };

    signIn(data);
  }

  return (
    <><View style={styles.background}>
      <View style={styles.containerLogo}>
        <Text style={styles.logoText}>Audote-me</Text>
        <Image style={styles.logo} source={require("../../assets/login2.png")} />
      </View>
      <View style={styles.container}>
        <View style={styles.containerInputText}>
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="black"
            style={styles.inputText}
            inputMode="email"
            value={email}
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
            !(email && password) && { backgroundColor: "#FB3D41" },
          ]}
          onPress={goToHome}
          disabled={!email || !password}
        >
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goRegister}>
          <Text style={styles.buttonText}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerLogo: {
    marginTop: 60,
    alignItems: "center",
  },
  logoText: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  logo: {
    width: "60%",
    height: 100,
  },
  containerInputText: {
    width: "95%",
    marginVertical: 20,
  },
  inputText: {
    height: 40,
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
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
  background:{
    backgroundColor: "#ffc0cb",
    height: 800,
  }
});
