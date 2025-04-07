import AsyncStorage from "@react-native-async-storage/async-storage";
export default class StorageService {

  static async saveData(
    newValue: any,
    key: string,
    succesCallback?: Function,
    failureCallback?: Function
  ) {
    console.log("save data");
    try {
      const jsonValue = JSON.stringify(newValue);
      await AsyncStorage.setItem(key, jsonValue);
      if (succesCallback) succesCallback();
    } catch (e) {
      console.error(e);
      if (failureCallback) failureCallback(e);
    }
  }

  static async loadData(key: string) {
    console.log("load data");

    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const value = jsonValue != null ? JSON.parse(jsonValue) : null;
      //console.log(`value data : ${value}`)
      if (value) {
        return value;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async clearZustandStore() {
    try {
      await AsyncStorage.removeItem("store-zustand");
      console.log(" Zustand store cleared");
    } catch (e) {
      console.error(" Error clearing Zustand store", e);
    }
  }

}
