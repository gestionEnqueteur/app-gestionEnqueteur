import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { useStoreZustand } from "../store/storeZustand";
import { StatusEnum } from "../models/enum";
import DetailCourse from "../components/DetailCourse";

export default function TrainASaisiScreen() {
  const courses = useStoreZustand((state) => state.courses);
  const filteredCourses = courses.filter(
    (course) => course.status === StatusEnum.TO_FILL
  );

  //Dès que le dispatchCourse met à jour les données avec load, tous les composants abonnés sont re-render automatiquement.
  //Le FlatList affiche alors uniquement les cours restants filtrés + triés.
  //si course change dans le store, la liste de course se met a jour

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DetailCourse course={item} key={item.id.toString()} />
        )}
        ListEmptyComponent={<Text>Aucun train à saisir</Text>}
      />
    </View>
  );
}
