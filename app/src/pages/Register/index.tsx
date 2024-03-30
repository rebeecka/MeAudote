import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import * as ImagePicker from 'expo-image-picker';
import { Registro } from '../../lib/user';
import { ScrollView } from 'react-native';

export default function Register() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [base64, setBase64] = useState<string | null>(null);

    const navigation = useNavigation();

    async function handlRegister() {
        const novoRegistro: Registro = {
            name: name,
            image: base64!!,
            email: email,
            phone: phone,
            password: password
        };

        api.post('/users', novoRegistro)
            .then((response) => {
                if (response.status == 201) {
                    Alert.alert("Cadastro realizado com sucesso, realize o login")
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
                base64: true
            });
            if (!result.canceled) {
                setSelectedImageUri(result.assets!![0].uri)
                setBase64(result.assets!![0].base64!!)
            }

        } catch (error) {
            console.error('Erro ao selecionar imagem');
        }
    }

    return (
       <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
             <Text style={styles.logoText}>Audote-me</Text>
            <TouchableOpacity onPress={selectFile} style={styles.buttonImg}>
                {selectedImageUri ? (
                    <Image style={styles.img} source={{ uri: selectedImageUri }} />
                ) : (<Image style={styles.img} source={require('../../assets/avatar.jpg')} />)}
            </TouchableOpacity>
            <View style={styles.containerInputText}>
                <TextInput
                    placeholder='Nome Completo'
                    placeholderTextColor='black'
                    style={styles.inputText}
                    value={name}
                    inputMode='text'
                    onChangeText={setName}
                />
                <TextInput
                    placeholder='Telefone'
                    placeholderTextColor='black'
                    style={styles.inputText}
                    inputMode='tel'
                    // keyboardType={'phone-pad'}
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    placeholder='E-mail'
                    placeholderTextColor='black'
                    style={styles.inputText}
                    value={email}
                    inputMode='email'
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder='Senha'
                    placeholderTextColor='black'
                    style={styles.inputText}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            <TouchableOpacity style={[styles.button, !(name && phone && email && password) && { backgroundColor: "#FB3D41" }]} onPress={handlRegister}>
                <Text style={styles.buttonText}>CADASTRAR</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopWidth: 100,
        borderTopColor: "#ffc0cb",
        alignItems: 'center',
        backgroundColor: "#ffc0cb",
    },
    containerInputText: {
        width: '95%',
        marginVertical: 20
    },
    inputText: {
        height: 40,
        fontSize: 18,
        paddingHorizontal: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#6C7B8B',
        marginBottom: 12
    },
    button: {
        width: '95%',
        height: 60,
        backgroundColor: '#FB3D41',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 12,
        
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonImg: {
        marginVertical: 50
    },
    img: {
        width: 120,
        height: 120,
        borderRadius: 120 / 2
    },
    logoText: {
        fontSize: 35,
        fontWeight: "bold",
        marginBottom: 20,
        color: "black",
      },
      scrollViewContent: {
        flexGrow: 1,
       
        height: 1100,
      },
})

