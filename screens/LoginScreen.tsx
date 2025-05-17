import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import useApi from "../hook/useApi";
import { useStoreZustand } from "../store/storeZustand";
import { AxiosError } from "axios";
import useSnackBar from "../hook/useSnackBar";
import { getExpoPushTokenAsync } from "expo-notifications";


export default function LoginScreen() {

  const [form, setForm] = useState({ identifier: "", password: "" });
  const setUrlApi = useStoreZustand(state => state.setUrlApi);
  const urlApi = useStoreZustand(state => state.urlApi);
  const setJwt = useStoreZustand(state => state.setJwt)
  const [isLoading, setIsLoading] = useState(false);

  const api = useApi();
  const snackBar = useSnackBar();

  const handleOnSubmit = async () => {
    try {
      setIsLoading(true);

      const expoPushToken = await getExpoPushTokenAsync();
      console.log(expoPushToken)
      const responseApi = await api.post<{ access_token: string }>('/auth/loginApp', {
        username: form.identifier,
        password: form.password,
        expoPushToken: expoPushToken.data,
      });
      console.log(responseApi.data);

      setJwt(responseApi.data.access_token);


    }
    catch (error) {

      if (!(error instanceof AxiosError)) {
        snackBar({ children: "erreur inconnu" });
        return;
      }

      switch (error.response?.status) {
        case 401:
          snackBar({ children: "Login incorrect" });
          break;
        case 400:
          snackBar({ children: `Mauvaise request: ${error.response?.data?.message}`});
          break;
        case 429:
          snackBar({ children: "Doucement avec le bouton, ne le casse pas" });
          break;
        case 500:
          snackBar({ children: "Le serveur API à planté" });
          break;
        default:
          snackBar({ children: `pas de réponse du Serveur` })
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
          onChangeText={identifier => setForm({ ...form, identifier })}
        />
        <TextInput
          label="Mot de passe :"
          onChangeText={password => setForm({ ...form, password })}
          secureTextEntry
        />

        <Button mode="contained" loading={isLoading} onPress={handleOnSubmit} disabled={isLoading}>Valider</Button>

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
