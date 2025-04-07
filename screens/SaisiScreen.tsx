import { Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import useSynchroApi from "../hook/useSynchroApi";
import useSnackBar from "../hook/useSnackBar";
import {useStoreZustand} from "../store/storeZustand";
import StorageService from "../services/StorageServices";

export default function SaisiScreen() {
  const { synchroApiPush, synchroApiPull } = useSynchroApi();
  const snackbar = useSnackBar();
  const dispatchCourse = useStoreZustand((state) => state.dispatchCourse);

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

  // Test de la suppression d'une seule course
  const handleDeleteSingle = (courseId: number) => {
    dispatchCourse({
      type: "delete",
      courseIds: [courseId], // Suppression de la course par ID
    });
    snackbar({children: "Course supprimée"});
  };

  // Test de la suppression en masse
  const handleDeleteAll = () => {
    dispatchCourse({
      type: "delete",
      courseIds: [1, 2, 3], // Suppression en masse
    });
    snackbar({children: "Toutes les courses supprimées"});
  };

  // Handle for clearing Zustand store
  const handleClearZustandStore = async () => {
    try {
      await StorageService.clearZustandStore();
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

        {/* Suppression manuelle */}
        <Button mode="outlined" onPress={() => handleDeleteSingle(1)}>
          Supprimer Course 1
        </Button>

        {/* Suppression en masse */}
        <Button mode="outlined" onPress={handleDeleteAll}>
          Supprimer toutes les courses
        </Button>

        {/* Nouveau bouton pour vider le store Zustand */}
        <Button mode="outlined" onPress={handleClearZustandStore}>
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
