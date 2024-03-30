import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Pet } from "../../lib/pet";
import { API_URL } from "../../lib/constants";

interface CardPetProps {
  pet: Pet;
  selectedItem: (pet: Pet) => void;
}

export function CardPet({ pet, selectedItem }: CardPetProps) {
  const genderSelection = (gender: String) => {
    const imagePath =
      gender === "Macho"
        ? require("../../assets/ic_masculino.png")
        : require("../../assets/ic_feminino.png");
    return <Image style={styles.imageGender} source={imagePath} />;
  };

  const selectPet = () => {
    selectedItem(pet);
  };

  return (
    <View style={styles.container}>
      <View>
        {pet.images && pet.images.length > 0 ? (
          <Image
            style={styles.image}
            source={{ uri: `${API_URL}files/${pet.images[0].name}` }}
          />
        ) : (
          <Image
            style={styles.image}
            source={require("../../assets/no_icon.png")}
          />
        )}
      </View>

      <View style={[{ justifyContent: "center" }]}>
        <View style={styles.containerInfo}>
          <View>
            <Text style={styles.title}>{pet.name}</Text>
            <Text style={styles.label}>{pet.breed}</Text>
            <Text style={styles.label}>{pet.age}</Text>
          </View>

          <View style={styles.containerGender}>
            {genderSelection(pet.gender)}
          </View>
        </View>

        <View style={[styles.boxButton]}>
          <TouchableOpacity style={styles.button} onPress={selectPet}>
            <Text style={styles.buttonText}>Mais informações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 120,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor:"rgba(255,133,133,28)",
  },
  containerInfo: {
    width: "150%",
    padding: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    marginStart: 12,
    alignContent: "space-between",
  },
  image: {
    width: 120,
    height: "100%",
    borderRadius: 12,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    color: "#000000",
    fontWeight: 'bold'
  },
  label: {
    fontSize: 14,
    color: "#000000",
  },
  containerGender: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  imageGender: {
    width: 30,
    height: 30,
  },
  boxButton: {
    width: "150%",
    marginStart: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 30,
    backgroundColor: "#FB3D41",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 12,
    
  },
  buttonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
