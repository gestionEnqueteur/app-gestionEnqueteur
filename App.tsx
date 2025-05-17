import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import AppProvider from "./provider/AppProvider";
import StackNavigation from "./screens/navigations/StackNavigation";
import MainSnackBar from "./components/MainSnackBar";


export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <AppProvider>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </AppProvider>
      <MainSnackBar />
    </PaperProvider>
  );
}
