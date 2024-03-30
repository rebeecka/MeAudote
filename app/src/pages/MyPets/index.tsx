import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  Alert
} from "react-native";
import { Icon } from "react-native-elements";
import { CardPet } from "../../components/CardPet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { TabView, TabBar } from "react-native-tab-view";
import { ScrollView } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import api from "../../services/api";
import { Pet, PetList } from "../../lib/pet";
import { AuthContext } from "../../contexts/AuthContext";

export default function MyPets() {
  const [petData, setPetData] = useState<PetList | null>(null);
  const [index, setIndex] = React.useState(0);
  const [key, setKey] = useState("cães");
  const [term, setTerm] = useState("");
  const { accessToken } = useContext(AuthContext);

  const layout = useWindowDimensions();
  const [routes] = React.useState([
    { key: "cães", title: "Cães" },
    { key: "gatos", title: "Gatos" },
    { key: "roedores", title: "Roedores" },
    { key: "aves", title: "Aves" },
  ]);

  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  useEffect(() => {
    getPets(key);
  }, [term, key]);

  function goToInfoPet(petSelected: Pet) {
   
    navigation.navigate("InfoPet", { pet: petSelected, isLogged: true, isMyPet: true });
  }

  async function getPets(index: string) {
    const url = `/pets?page=1&limit=10000000&me=true&category=${index}&name=${term}`;
    
    api
      .get<PetList>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (
          response.status === 200 &&
          (response.data as PetList).length > 0
        ) {   
          setPetData(response.data);
        } else {
          setPetData(null);
        }
      })
      .catch((error) => {
        if(error.response)
          Alert.alert(error.response.data?.message);
        else
          Alert.alert('Erro ao buscar os dados');
        setPetData(null);
      });
  }

  return (
    <View style={styles.background}>
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="gray" style={{ padding: 10 }} />
          <TextInput
            placeholder="Pesquisar"
            placeholderTextColor="#6C7B8B"
            style={styles.inputText}
            value={term}
            onChangeText={setTerm}
          />
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={() => null}
          onIndexChange={setIndex}
          initialLayout={layout}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              renderLabel={({ focused, route }) => (
                <Text
                  style={{
                    padding: 4,
                    borderRadius: 24,
                    backgroundColor: focused ? "#F95F62" : "#ffc0cb",
                    color: focused ? "black" : "black",
                  }}
                >
                  {route.title}
                </Text>
              )}
              indicatorStyle={styles.indicatorStyle}
              style={styles.tabBar}
              onTabPress={({ route, preventDefault }) => {
                setIndex(routes.findIndex((r) => r.key === route.key));
                setKey(route.key);
              }}
            />
          )}
        />
        <View></View>

        <View
          style={{
            marginTop: 16,
            marginHorizontal: 24,
          }}
        >
          {petData ? (
            petData.map((pet, index) => (
              <CardPet
                key={index}
                pet={pet}
                selectedItem={(petSelected) => goToInfoPet(petSelected)}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>Nenhum pet disponível</Text>
          )}
        </View>
      </ScrollView>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 16,
  },
  tabBar: {
    backgroundColor: "#ffc0cb",
    borderBottomWidth: 1,
    borderColor: Colors.BLACK,
  },
  indicatorStyle: {
    backgroundColor: "#FB3D41",
  },
  divider: {
    zIndex: 100,
    position: "absolute",
    width: 1,
    height: 48,
    backgroundColor: "black",
    alignSelf: "center",
  },
  container: {
    flexDirection: "column",
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    marginTop: 8,
  },
  inputText: {
    height: 40,
    width: "80%",
    fontSize: 18,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#6C7B8B",
    marginBottom: 12,
  },
  background:{
    backgroundColor: "#ffc0cb",
    height: 800,
  }
});
