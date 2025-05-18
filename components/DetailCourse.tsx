import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import CardNumeroLine from "./CardNumeroLine";
import ChronoTopDepart from "./ChronoTopDepart";
import DetailTrajet from "./DetailTrajet";
import MenuBurger from "./MenuBurger";
import Quotas from "./Quotas";
import TypeCourse from "./TypeCourse";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Course from "../models/Course";
import { RootStackParamList } from "../screens/navigations/StackNavigation";

type Props = {
  course: Course;
};

export default function DetailCourse(props: Readonly<Props>) {
  const { course } = props;

  // utilisation du hook use navigation
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //console.log(`création composant : ${course.id}`)

  const handleGoToAction = () => {
    // appuie sur le composant
    switch (course.mission) {
      case "BSC":
        console.log("Basculement vers la page de saisie");
        navigation.navigate("SaisieBsc", { courseId: course.id });

        break;
      case "HLP VS":
        console.log("afficher le link waze ou cordonner GPS");
        break;
      default:
        console.log("pas action pour ce type de mission");
    }
  };

  return (
    <TouchableRipple onPress={handleGoToAction}>
      <View style={style.container}>
        <View style={style.lineUp}>
          <View style={style.detailTime}>
            {course.infoHoraireCourse && (
              <ChronoTopDepart
                depart={course.infoHoraireCourse.datetimeArriveEnq}
                arrival={course.infoHoraireCourse.datetimeDepartEnq}
              />
            )}
            {course.infoHoraireCourse && (
              <DetailTrajet infoHoraireCourse={course.infoHoraireCourse} />
            )}
          </View>
          <View>
            {course.mission === "BSC" && (
              <MenuBurger course={course} />
            )}
          </View>
        </View>
        <View style={style.infoLine}>
          <TypeCourse mission={course.mission} />
          {course.ligne && <CardNumeroLine lineNumber={course.ligne} />}
          <Text variant="labelSmall">synchro: {course.isSynchro ? "OK" : "NO"}</Text>
          {course.objectif && <Quotas value={course.objectif} />}
          <Text variant="headlineSmall">{course.trainCourse}</Text>
        </View>
      </View>
    </TouchableRipple>
  );
}

const style = StyleSheet.create({
  container: {
    margin: "1%",
    padding: "1%",
    borderColor: "blue",
    borderStyle: "solid",
    borderWidth: 1,
  },
  lineUp: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  infoLine: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  detailTime: {
    flexDirection: "row",
    width: 200,
  },
});
