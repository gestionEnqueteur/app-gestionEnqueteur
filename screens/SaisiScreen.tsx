import { Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import useSynchroApi from "../hook/useSynchroApi";
import useSnackBar from "../hook/useSnackBar";

export default function SaisiScreen() {
  const { synchroApiPush, synchroApiPull } = useSynchroApi();
  const snackbar = useSnackBar(); 

  const handlePull = async () => {
    try {
      await synchroApiPull(); 
      snackbar({children: "Récupération data réussi"}); 
    }
    catch(error) {
      snackbar({children: "La récupération à échoué"});  
    }
    
  }

  const handlePush = async () => {
    try {
      await synchroApiPush(); 
      snackbar({children: "Envoi réussi"}); 
    }
    catch(error) {
      snackbar({children: "L'envoi à échoué"});  
    }
  }

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => handlePush()}>
        Push
      </Button>
      <Button mode="contained" onPress={() => handlePull()}>
        Pull
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
