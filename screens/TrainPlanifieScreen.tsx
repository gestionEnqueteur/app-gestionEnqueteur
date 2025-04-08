import {FlatList, View} from "react-native";
import DetailCourse from "../components/DetailCourse";
import Course from "../models/Course";
import {Button, Text} from "react-native-paper";
import { useStoreZustand } from "../store/storeZustand";
import useSynchroApi from "../hook/useSynchroApi";
import useSnackBar from "../hook/useSnackBar";
import useCourseCleaner from "../hook/useCourseCleaner";
import mokCourses from "../mock/courses.json"


export default function TrainPlanifieScreen() {
  const courses = useStoreZustand((state) => state.courses);
  const snackbar = useSnackBar(); 
  const { synchroApiPush, synchroApiPull } = useSynchroApi();
  const dispatchCourse = useStoreZustand((state) => state.dispatchCourse);
  const { cleanup } = useCourseCleaner();  // Importation et utilisation du hook
  console.log(`mount TrainPlanifieScreen `);

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
      <View style={{ flex: 1 }}>
        <FlatList
            data={courses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onRefresh={handleOnRefresh}
            refreshing={false}
            ListEmptyComponent={<Text>La liste est vide</Text>}
        />
      </View>
  );
}
