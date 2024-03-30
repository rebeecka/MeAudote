import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { StackParamsList } from "../../routes/app.routes";
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { RouteProp, useNavigation } from "@react-navigation/native";
import ModalSelector from "react-native-modal-selector";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import api from "../../services/api";
import { ImageList, Pet, RegistroPet } from "../../lib/pet";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { API_URL } from "../../lib/constants";

type RootStackParamList = {
  RegisterPet: { pet: Pet; edit: boolean; };
};

type ScreenRouteProp = RouteProp<RootStackParamList, "RegisterPet">;

interface Props {
  route: ScreenRouteProp;
}

export default function RegisterPet({ route }: Props) {
  let listImagesAll: ImageList = [];
  const { pet, edit } = route.params;

  useEffect(() => {
    if (edit) {
      async function getPetReq() {
        await getPet();
      }
      getPetReq();
    }
  }, []);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [porte, setPorte] = useState("");
  const [castrated, setCastrated] = useState(false);
  const [vaccinated, setVaccinated] = useState(false);
  const [gender, setGender] = useState("Femea");
  const [categorySelected, setCategorySelected] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imagesElement, setImagesElement] = useState<any[]>([]);
  const [base64, setBase64] = useState<string[]>([]);
  const [numberPhotos, setNumberPhotos] = useState(0);
  const [imagesToList, setImagesToList] = useState<ImageList>([]);

  const [categories] = useState([
    { key: "cães", label: "Cães" },
    { key: "gatos", label: "Gatos" },
    { key: "roedores", label: "Roedores" },
    { key: "aves", label: "Aves" },
  ]);

  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const addStringToBase64 = (newString: string) => {
    setBase64((prevBase64) => [...prevBase64, newString]);
  };

  if (edit && !name) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1D1D2E', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={60} color='#FFF' />
      </View>
    );
  }

  async function getPet() {
    try {
      const response = await api.get<Pet>(`/pets/${pet.id}`);
      const respData = response.data;
      setName(respData.name);
      setAge(respData.age);
      setBreed(respData.breed);
      setPorte(respData.animal_size);
      setCastrated(respData.castrated);
      setVaccinated(respData.vaccinated);
      setGender(respData.gender);
      setCategorySelected(respData.category);
      imagesRegistered(respData.images);
    } catch (error: any) {
      if (error.response)
        Alert.alert(error.response.data?.message);
      else
        Alert.alert('Erro ao buscar os dados');
    }
  }

  async function handlerRegisterPet() {
    let b64 = imagesToList.map(img => img.base64);
    b64 = b64.filter(img => img != null && img != '');
    const novoRegistro: RegistroPet = {
      name: name,
      images: b64,
      category: categorySelected,
      vaccinated: vaccinated,
      animal_size: porte,
      castrated: castrated,
      breed: breed,
      age: age,
      gender: gender
    };

    api
      .post("/pets", novoRegistro)
      .then((response) => {
        if (response && response.data && response.status == 200) {
          Alert.alert("Cadastro de pet realizado com sucesso!");
          const data: Pet = {
            id: response.data.id,
            name: response.data.name,
            age: response.data.age,
            breed: response.data.breed,
            images: response.data.images,
            gender: response.data.gender,
            castrated: response.data.castrated,
            vaccinated: response.data.vaccinated,
            animal_size: response.data.animal_size,
            category: response.data.category,
            user_id: response.data.user.id,
            user: response.data.user
          };
          navigation.navigate('InfoPet', { pet: data, isLogged: true, isMyPet: true });
        }
      })
      .catch((error) => {
        if (error.response)
          Alert.alert(error.response?.data?.message);
        else
          Alert.alert('Erro ao cadastrar pet');
      });
  }

  async function handlerUpdatePet() {
    let b64 = imagesToList.map(img => img.base64);
    b64 = b64.filter(img => img != null && img != '');
    let images = imagesToList.map(img => img.name);
    images = images.filter(img => img != null && img != '');
    const updateRegistro: RegistroPet = {
      name: name,
      images: images,
      newImages: b64,
      category: categorySelected,
      vaccinated: vaccinated,
      animal_size: porte,
      castrated: castrated,
      breed: breed,
      age: age,
      gender: gender,
    };

    api
      .put(`/pets/${pet.id}`, updateRegistro)
      .then((response) => {
        if (response && response.data && response.status == 200) {
          Alert.alert("Informações atualizadas com sucesso!");
          const data: Pet = {
            id: response.data.id,
            name: response.data.name,
            age: response.data.age,
            breed: response.data.breed,
            images: response.data.images,
            gender: response.data.gender,
            castrated: response.data.castrated,
            vaccinated: response.data.vaccinated,
            animal_size: response.data.animal_size,
            category: response.data.category,
            user_id: response.data.user.id,
            user: response.data.user
          };
          navigation.navigate('InfoPet', { pet: data, isLogged: true, isMyPet: true });
        }
      })
      .catch((error) => {
        if (error.response)
          Alert.alert(error.response?.data?.message);
        else
          Alert.alert('Erro ao atualizar pet');
      });
  }

  async function selectFile() {
    try {
      if (numberPhotos === 5) {
        Alert.alert('Permitido o upload de no máximo 5 imagens!');
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        selectionLimit: 5
      });

      setSelectedImageUri(result.assets!![0].uri);
      let imageUrl = result.assets!![0].uri || "";
      setImagesToList((oldArray) => [...oldArray, { name: '', url: imageUrl, base64: result.assets!![0].base64!! }]);
      listImagesAll = imagesToList;
      setSelectedImages((oldArray) => [...oldArray, imageUrl]);
      setImagesList();
      addStringToBase64(result.assets!![0].base64!!);
      setNumberPhotos(listImagesAll.length + 1);
    } catch (error) {
      console.error("Erro ao selecionar imagem");
    }
  }

  function deleteImageRegistered(urlImage: string, imagesListAll: any[]) {
    if (edit) {
      const urlImageSplit = urlImage.split('/');
      const name = urlImageSplit[urlImageSplit.length - 1];
      let images = imagesListAll.filter(img => img.name != name);
      listImagesAll = images;
      setNumberPhotos(listImagesAll.length + 1);
      setImagesList();
      setImagesToList(images);
    }
  }

  function deleteNewImage(urlImage: string, imagesListAll: any[]) {
    const images = imagesListAll.filter(img => img.url !== urlImage);
    listImagesAll = images;
    setNumberPhotos(listImagesAll.length + 1);
    setImagesList();
    setImagesToList(images);
  }

  function imagesRegistered(images: any[]) {
    const imagesAll = images.map((img) => {
      const url = `${API_URL}files/${img.name}`;
      return {
        name: img.name,
        url: url
      };
    });
    listImagesAll = imagesAll;
    setNumberPhotos(listImagesAll.length + 1);
    setImagesList();
    setImagesToList(imagesAll);
  }

  function setImagesList() {
    let images = listImagesAll;
    let imagesAll = images.map((img, index) => {
      return (
        <View key={index} style={styles.viewImagesList}>
          <Image style={styles.listImages} source={{ uri: img.url }} />
          {img.name && <TouchableOpacity onPress={() => deleteImageRegistered(img.url || "", images)}>
            <Feather name="trash-2" size={22} color='#FF3F4b' />
          </TouchableOpacity>}
          {!img.name && <TouchableOpacity onPress={() => deleteNewImage(img.url || "", images)}>
            <Feather name="trash-2" size={22} color='#FF3F4b' />
          </TouchableOpacity>}
        </View>
      )
    });
    setImagesElement(imagesAll);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={selectFile} style={styles.buttonImg}>
          {selectedImageUri ? (
            <View>
              <Image style={styles.img} source={{ uri: selectedImageUri }} />
              {numberPhotos > 0 && <Text>{numberPhotos}</Text>}
            </View>
          ) : (
            <Image
              style={styles.img}
              source={require("../../assets/camera2.png")}
            />
          )}
          {numberPhotos === 0 && <Text>Selecione as Imagens</Text>}
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.scrollImages}>
            {imagesElement}
          </View>
        </ScrollView>
        <TextInput
          placeholder="Nome"
          placeholderTextColor="black"
          style={styles.inputText}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Idade"
          placeholderTextColor="black"
          style={styles.inputText}
          value={age}
          onChangeText={setAge}
        />
        <TextInput
          placeholder="Raça"
          placeholderTextColor="black"
          style={styles.inputText}
          value={breed}
          onChangeText={setBreed}
        />
        <TextInput
          placeholder="Porte"
          placeholderTextColor="black"
          style={styles.inputText}
          value={porte}
          onChangeText={setPorte}
        />
        <View style={styles.containerCheckBox}>
          <Text style={styles.label}>Castrado</Text>
          <View style={styles.checkBox}>
            <RadioButton
              value="Sim"
              status={castrated === true ? "checked" : "unchecked"}
              onPress={() => setCastrated(true)}
            />
            <Text style={styles.label2}>Sim</Text>
            <RadioButton
              value="Não"
              status={castrated === false ? "checked" : "unchecked"}
              onPress={() => setCastrated(false)}
            />
            <Text style={styles.label2}>Não</Text>
          </View>
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.checkBox}>
            <RadioButton
              value="Macho"
              status={gender === "Macho" ? "checked" : "unchecked"}
              onPress={() => setGender("Macho")}
            />
            <Text style={styles.label2}>Macho</Text>
            <RadioButton
              value="Femea"
              status={gender === "Femea" ? "checked" : "unchecked"}
              onPress={() => setGender("Femea")}
            />
            <Text style={styles.label2}>Femea</Text>
          </View>
          <Text style={styles.label}>Vacinado</Text>
          <View style={styles.checkBox}>
            <RadioButton
              value="Sim"
              status={vaccinated === true ? "checked" : "unchecked"}
              onPress={() => setVaccinated(true)}
            />
            <Text style={styles.label2}>Sim</Text>
            <RadioButton
              value="Não"
              status={vaccinated === false ? "checked" : "unchecked"}
              onPress={() => setVaccinated(false)}
            />
            <Text style={styles.label2}>Não</Text>
          </View>
        </View>
        <Text style={styles.label}>Categoria</Text>

        <ModalSelector
          data={categories}
          initValue="Selecione uma categoria"
          scrollViewAccessibilityLabel={"Scrollable options"}
          cancelButtonAccessibilityLabel={"Cancel Button"}
          onChange={(option) => {
            setCategorySelected(option.key);
          }}
        >
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#000000",
              color: "black",
              paddingHorizontal: 8,
              width: 300,
              height: 30,
              
            }}
            editable={false}
            placeholder="Selecione uma categoria"
            value={categorySelected}
            
          />
          <Icon
            name="chevron-down"
            size={15}
            color="#000000"
            style={styles.icon}
          />
        </ModalSelector>

        <TouchableOpacity
          style={[
            styles.button,
            ,
            !(name && age && breed && porte && categorySelected) && { backgroundColor: "#FB3D41" },
          ]}
          onPress={!edit ? handlerRegisterPet : handlerUpdatePet}
        >
          <Text style={styles.buttonText}>SALVAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffc0cb",
    
  },
  icon: {
    position: "absolute",
    top: 7,
    right: 10,
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
  label2: {
    fontSize: 16,
    marginTop: 4,
    marginEnd: 20,
    color: "black",
    fontWeight: "bold",
    alignContent: "center",
    justifyContent: "center",
    
  },
  containerCheckBox: {
    alignItems: "center",
    
  },
  checkBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  
  },
  selectButton: {
    width: "95%",
    height: 40,
    fontSize: 18,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectButtonText: {
    marginTop: 10,
    fontSize: 18,
    color: "black",
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
  buttonImg: {
    marginVertical: 50,
    
    
  },
  img: {
    width: 150,
    height: 120,
    borderRadius: 120 / 2,
  },
  scrollImages: {
    flex: 1,
    flexDirection: 'row'
  },
  viewImagesList: {
    padding: 5
  },
  listImages: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2
  }
});
