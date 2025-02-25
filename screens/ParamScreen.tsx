import { View, ScrollView, StyleSheet, Alert, AlertButton } from "react-native";
import { Text, TextInput, Button, Surface } from "react-native-paper";
import { useEffect, useState } from "react";
import ConfigurationType from "../models/ConfigurationType";
import useSnackBar from "../hook/useSnackBar";
import StorageService from "../services/StorageServices";
import { useStoreZustand } from "../store/storeZustand";



export default function ParamScreen() {

  const urlApi = useStoreZustand(state => state.urlApi); 
  const setUrlApi = useStoreZustand(state => state.setUrlApi); 
  const dispatch = useStoreZustand(state => state.dispatchCourse); 

  const [valueForm, setValueForm] = useState<ConfigurationType>({
    urlApi: "",
    user: "",
  });

  const displaySnackBarCommun = useSnackBar();

  useEffect(() => {
    // Init de la page

    console.log("Init ParamScreem");
    setValueForm((state) => ({ ...state, urlApi: urlApi }));
  }, []);

  const handleOnChangeURL = (newValue: string) => {
    setValueForm({ ...valueForm, urlApi: newValue });
    //TODO: rajouter vérification sur URL
  };

  const handleOnChangeUser = (newValue: string) => {
    setValueForm({ ...valueForm, user: newValue });
    //TODO: rajouter vérification sur user
  };

  const handleOnClickSubmit = () => {
    // stockage dans le AsyncStorage
    //TODO: appliquer une vérification de la cohérence, via des regex par exemple
    /**
     * @deprecated Inutile , le middleware de Zustand fait le boulot
     */
    StorageService.saveData(
      valueForm,
      "configuration",
      succesSave,
      failureSave
    );
    //setConfig(valueForm);
    setUrlApi(valueForm.urlApi)
  };

  const succesSave = () => {
    console.info("succes de la sauvegarde");

    displaySnackBar("Paramètre sauvegardé", "content-save");
  };

  const failureSave = (e: Error) => {
    displaySnackBar("Erreur d'enregistrement", "alert-circle");
  };

  const displaySnackBar = (label: string, icon: string) => {
    displaySnackBarCommun({
      children: label,
      icon: icon,
      duration: 2000,
      onIconPress: () => {},
    });
  };

  const deletingCourse = () => {
    dispatch({type: "reset"}); 
  }

  const handleOnDeleting = () => {

    const BtnDeleting: AlertButton = {text: "Suppresion", onPress: deletingCourse }; 
    const BtnCancel: AlertButton = {text: "Annuler", onPress: () => console.log("test")}; 

    Alert.alert("Attention", "vous etes sur, cette opération est irréversible ? ", 
      [BtnDeleting, BtnCancel], 
      {cancelable: true}
    );  
  }

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Surface style={style.areaParam}>
        <View>
          <Text>URL API : </Text>
          <TextInput
            mode="outlined"
            label="Endpoint API"
            placeholder="URL API"
            onChangeText={handleOnChangeURL}
            value={valueForm.urlApi}
          />
        </View>
        <View>
          <Text>Enquetteur</Text>
          <TextInput
            mode="outlined"
            label="enqueteur"
            placeholder="trigramme enqueteur
           ou nom enqueteur"
            onChangeText={handleOnChangeUser}
            value={valueForm.user}
          />
        </View>
        <View style={style.buttonArea}>
          <View>
            <Button
              mode="contained-tonal"
              onPress={() => console.log("click sur le bouton Tester API")}
            >
              Tester API
            </Button>
          </View>
          <View>
            <Button mode="contained-tonal" onPress={handleOnClickSubmit}>
              Enregistrer
            </Button>
          </View>
        </View>
      </Surface>
      <Button mode="contained" onPress={handleOnDeleting}>Effacer data</Button>
      <Button mode="contained">Syncronisation enquête</Button>
      <Button mode="contained">Recherche mise à jour application</Button>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    margin: 7,
    justifyContent: "space-evenly",
    gap: 6,
  },
  areaParam: {
    gap: 5,
    padding: 4,
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
