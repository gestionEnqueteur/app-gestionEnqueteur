import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import useApi from "../hook/useApi";
import { useStoreZustand } from "../store/storeZustand";
import { AxiosError } from "axios";
import useSnackBar from "../hook/useSnackBar";
import {getExpoPushTokenAsync} from "expo-notifications";


export default function LoginScreen() {

  const [form, setForm ] = useState({identifier: "", password: ""}); 
  const setUrlApi = useStoreZustand(state => state.setUrlApi); 
  const urlApi = useStoreZustand(state => state.urlApi); 
  const setJwt = useStoreZustand(state => state.setJwt)
  const [isLoading, setIsLoading ] = useState(false);  

  const api = useApi(); 
  const snackBar = useSnackBar(); 

  const handleOnSubmit = async () => {
    try {
      setIsLoading(true);

      const expoPushToken = await getExpoPushTokenAsync();
      const responseApi = await api.post<{ jwt: string, user: unknown}>('/auth/loginApp', {
        username: form.identifier,
        password: form.password,
        expoPushToken: expoPushToken,
      }); 
      console.log(responseApi.data); 

      setJwt(responseApi.data.jwt); 

  
    }
    catch (error) {
      console.error(error);
      if (error instanceof AxiosError ) {
        if(error.code === '400') {
          snackBar({children: "Login incorrect"}); 
        }
        if(error.code === '429') {
          snackBar({children: "Doucement avec le bouton, ne le casse pas"}); 
        }
        if(error.code === '500') {
          snackBar({children: "Le serveur API à planté"}); 
        }
      }
    }
    finally {
      // the end 
      setIsLoading(false);   
    }
  } 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.areaForm}>
        <TextInput 
          label="Serveur API : "
          onChangeText={server => setUrlApi(server)}
          value={urlApi}
        />
        <TextInput 
          label="Identifiant :"
          onChangeText={identifier => setForm({...form, identifier})}
        />
        <TextInput 
          label="Mot de passe :"
          onChangeText={password => setForm({...form, password})}
          secureTextEntry
        />

        <Button mode="contained" loading={isLoading} onPress={handleOnSubmit}>Valider</Button>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 20, 
  },
  title: {
    marginTop: 70, 
  },
  areaForm: { 
    flex: 2, 
    width: '80%',
    gap: 20, 
  }
});
