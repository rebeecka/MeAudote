import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert
} from "react-native";
import { Image } from "react-native-elements";
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { Pet } from "../../lib/pet";
import { ImageViewer } from "../../components/image";
import api from "../../services/api";

type RootStackParamList = {
  InfoPet: { pet: Pet; isLogged: boolean; isMyPet: boolean };
};

type ScreenRouteProp = RouteProp<RootStackParamList, "InfoPet">;

interface Props {
  route: ScreenRouteProp;
}

export default function InfoPet({ route }: Props) {
  const { pet, isLogged, isMyPet } = route.params;
  console.log(pet);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  function goToLogin() {
    navigation.navigate("Login", {});
  }

  const genderSelection = (gender: String) => {
    const imagePath =
      gender === "Macho"
        ? require("../../assets/ic_masculino.png")
        : require("../../assets/ic_feminino.png");
    return <Image style={styles.imageGender} source={imagePath} />;
  };

  const handleAdopt = () => {
    let url =
      "whatsapp://send?text=" +
      `Olá, vi seu anúncio no app Audote-me e tenho interesse em adotar. Poderia me passar mais informações sobre o pet de nome ${pet.name}?` +
      "&phone=91" +
      pet.user?.phone;
    Linking.openURL(url)
      .then((data) => {
      })
      .catch((error) => {
        if (error.response)
          Alert.alert(error.response.data?.message);
        else
          Alert.alert('Erro ao buscar os dados');
      });
  };

  async function deletePet() {
    Alert.alert('Deletar', `Tem certeza que deseja deletar o pet ${pet.name}?`, [
      {
        text: 'Cancelar',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'Sim', onPress: async () => {
          try {
            await api.delete(`/pets/${pet.id}`);
            Alert.alert('Deletado com sucesso!');
            navigation.navigate("MyPets", {});
          } catch (error: any) {
            if (error.response)
              Alert.alert(error.response.data?.message);
            else
              Alert.alert('Erro ao deletar');
          }
        }
      },
    ]);
  }
  function calculateAge(birthDate: Date | null): string {
    if (!birthDate) return "Data de nascimento não fornecida";
  
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
  
    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
  
    return `${age} anos`;
  }
  
  
  
  return (
    <View style={styles.background}>
      <View style={styles.imageContainer}>
        {pet.images && pet.images.length > 0 ? (
          <ImageViewer images={pet.images.map((img) => img.name)} />
        ) : (
          <Text style={styles.noImages}>Não possui imagens</Text>
        )}
      </View>

      <View style={[styles.containerMain, { marginTop: 8 }]}>
        <Text style={styles.title}>{pet.name}</Text>
        {genderSelection(pet.gender)}
      </View>
      {isMyPet && <View style={styles.groupButtonsEdit}>
        <TouchableOpacity style={styles.buttonEdit} onPress={() => navigation.navigate('RegisterPet', { pet: pet, edit: true })}>
          <Feather name="edit" size={22} color='black' />
        </TouchableOpacity>
        <TouchableOpacity onPress={deletePet}>
          <Feather name="trash-2" size={22} color='black' />
        </TouchableOpacity>
      </View> }
      <View style={styles.containerInfo}>
        <View>
          <Text style={styles.label}>Categoria: {pet.category}</Text>
          <Text style={styles.label}>
            Castrado: {pet.castrated ? "Sim" : "Não"}
          </Text>
          <Text style={styles.label}>Raça: {pet.breed}</Text>
        </View>

        <View>
          <Text style={styles.label}>Porte: {pet.animal_size}</Text>
          <Text style={styles.label}>
            Vacinado: {pet.vaccinated ? "Sim" : "Não"}
          </Text>
          <Text style={styles.label}>Idade: {calculateAge(pet.birthDate)}</Text>


        </View>
      </View>

      <View>
        {pet.user?.name && (
          <Text style={styles.label3}>Cadastrado por: {pet.user.name}</Text>
        )}

        {!isLogged && (
          <View style={[styles.boxButton]}>
            <TouchableOpacity style={styles.button} onPress={goToLogin}>
              <Text style={styles.buttonText}>ADOTAR</Text>
            </TouchableOpacity>
          </View>
        )}

        {pet.user?.phone ? (
          <View>
            {isLogged && !isMyPet && (
              <View>
                <Text style={styles.label2}>
                  Fale com o responsável pelo WhatsApp!
                </Text>

                <View style={[styles.boxButton]}>
                  <TouchableOpacity style={styles.button} onPress={handleAdopt}>
                    <Text style={styles.buttonText}>ADOTAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View>
            <Text style={styles.label2}>Nenhuma informação de contato</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
    
  },
  containerInfo: {
    backgroundColor: "rgba(255,133,133,28)",
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
    paddingVertical: 8,
    justifyContent: "space-around",
  },
  title: {
    fontSize: 30,
    color: "black",
  },
  label: {
    fontSize: 16,
    paddingVertical: 4,
    color: "black",
    
  },
  label2: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 50,
    color: "black",
    textAlign: "center",
   
   
  },
  label3: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 50,
    color: "black",
    textAlign: "center",
   
    
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
    marginTop: 12,
    marginBottom: 12,
    
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: "45%",
    borderRadius: 60 / 2,
    resizeMode: "contain",
    
  },
  imageGender: {
    width: 50,
    height: 50,
  },
  noImages: {
    marginTop: 20,
    justifyContent: 'center',
    textAlign: 'center'
  },
  groupButtonsEdit: {
    flexDirection: 'row',
    paddingHorizontal: 16
  },
  buttonEdit: {
    marginRight: 20,
    
  },
  background:{
    backgroundColor: "#ffc0cb",
    height: 800,
  }
});
