import { Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import useSynchroApi from "../hook/useSynchroApi";
import useSnackBar from "../hook/useSnackBar";
import {useStoreZustand} from "../store/storeZustand";
import StorageService from "../services/StorageServices";
import useCourseCleaner from "../hook/useCourseCleaner";

export default function SaisiScreen() {
  const { synchroApiPush, synchroApiPull } = useSynchroApi();
  const snackbar = useSnackBar();
  const dispatchCourse = useStoreZustand((state) => state.dispatchCourse);
  const { cleanup } = useCourseCleaner()

  const handlePull = async () => {
    try {
      await synchroApiPull(); 
      snackbar({children: "Récupération data réussi"}); 
    }
    catch(error) {
      snackbar({children: "La récupération à échoué"});  
    }
    
  }
// boutton test avec dispatch(store) qui appelle addcourse (reducer)
  const handlePush = async () => {
    try {
      await synchroApiPush(); 
      snackbar({children: "Envoi réussi"}); 
    }
    catch(error) {
      snackbar({children: "L'envoi à échoué"});  
    }
  }


  // Handle for clearing Zustand store
  const handleClearOldCourses = async () => {
    try {
      cleanup(); 
      snackbar({children: "Zustand store vidé"});
    } catch (error) {
      snackbar({children: "Erreur lors de la suppression du store"});
    }
  };

  return (
      <View style={styles.container}>
        <Button mode="contained" onPress={() => handlePush()}>
          Push
        </Button>
        <Button mode="contained" onPress={() => handlePull()}>
          Pull
        </Button>

        {/* Nouveau bouton pour vider le store Zustand */}
        <Button mode="outlined" onPress={handleClearOldCourses}>
          Vider les données persistées
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
