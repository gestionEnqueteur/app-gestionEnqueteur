import { FlatList } from "react-native";
import DetailCourse from "../components/DetailCourse";
import Course from "../models/Course";
import { Text } from "react-native-paper";
import { useStoreZustand } from "../store/storeZustand";
import useSynchroApi from "../hook/useSynchroApi";
import useSnackBar from "../hook/useSnackBar";

export default function TrainPlanifieScreen() {
  const courses = useStoreZustand((state) => state.courses);
  const snackbar = useSnackBar(); 

  const { synchroApiPush, synchroApiPull } = useSynchroApi();

  console.log(`mount TrainPlanfieScreen `);

  const handleOnRefresh = async () => {
    try {
      console.log("refresh");
      await synchroApiPush();
      await synchroApiPull();
      console.log("end refresh");

    }
    catch(error) {
      snackbar({children: "Erreur de synchronisation ( réseau ?? )"}); 
    }
  };

  const renderItem = ({ item }: { item: Course }) => {
    console.log("render Item");
    return <DetailCourse course={item} key={item.id.toString()} />;
  };

  return (
    <FlatList
      data={courses}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onRefresh={handleOnRefresh}
      refreshing={false}
      ListEmptyComponent={<Text>La liste est vide </Text>}
    />
  );
}
