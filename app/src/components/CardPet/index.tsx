import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Pet } from "../../lib/pet";
import { API_URL } from "../../lib/constants";
import { format } from "date-fns";

interface CardPetProps {
  pet: Pet;
  selectedItem: (pet: Pet) => void;
}

export function CardPet({ pet, selectedItem }: CardPetProps) {
  const genderSelection = (gender: string) => {
    const imagePath =
      gender === "Macho"
        ? require("../../assets/ic_masculino.png")
        : require("../../assets/ic_feminino.png");
    return <Image style={styles.imageGender} source={imagePath} />;
  };

  const selectPet = () => {
    selectedItem(pet);
  };

  function calculateAge(birthDate: Date | null): string {
    if (!birthDate) return "Data de nascimento não fornecida";
  
    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays < 30) {
      return `${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    } else {
      const yearDiff = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const totalMonths = yearDiff * 12 + monthDiff;
  
      if (totalMonths < 12) {
        return `${totalMonths} mes${totalMonths !== 1 ? 'es' : ''}`;
      } else {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        if (months === 0) {
          return `${years} ano${years !== 1 ? 's' : ''}`;
        } else {
          return `${years} ano${years !== 1 ? 's' : ''} e ${months} mes${months !== 1 ? 'es' : ''}`;
        }
      }
    }
}

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
            <Text style={styles.label}>{calculateAge(pet.birthDate)}</Text>
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
