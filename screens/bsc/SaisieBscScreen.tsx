import { View, StyleSheet, ScrollView } from "react-native";
import { Avatar, Button, Surface, Text, TextInput } from "react-native-paper";

import CardNumeroLine from "../../components/CardNumeroLine";
import ChronoTopDepart from "../../components/ChronoTopDepart";
import DetailTrajet from "../../components/DetailTrajet";
import MenuBurger from "../../components/MenuBurger";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/StackNavigation";
import { useCourseById } from "../../hook/useCourseById";
import { useState } from "react";
import Questionnaires from "../../models/bsc/Questionnaire";
import { produce } from "immer";
import MesureBsc from "../../models/bsc/MesureBsc";
import { useStoreZustand } from "../../store/storeZustand";

type Props = NativeStackScreenProps<RootStackParamList, "SaisieBsc">;

export default function SaisiBscScreen({ route }: Readonly<Props>) {
  const course = useCourseById(route.params.courseId);
  const dispatch = useStoreZustand((state) => state.dispatchCourse);

  if (!(course.mesure instanceof MesureBsc)) {
    throw new Error("Mesure n'est pas une MesureBsc");
  }

  // raccoursie
  const { retards, infoTrain } = course.mesure;

  // state form questionnaire
  const [questionnaire, setQuestionnaire] = useState<Questionnaires>(
    course.mesure.questionnaires ?? {
      vides: 0,
      inexploitables: 0,
      distribuees: 0,
      exploitables: 0,
    }
  );

  // state error questionnaire
  const [errorDistribuee, setErrorDistribuee] = useState(false);
  const [errorVide, setErrorVide] = useState(false);
  const [errorInexploitable, setErrorInexploitable] = useState(false);
  const [errorExploitable, setErrorExploitable] = useState(false);

  // handleOnChangeQuestionnaire
  const handleOnChangeVide = (newValue: string) => {
    const vide = +newValue;
    Number.isNaN(vide) ? setErrorVide(true) : setErrorVide(false);
    setQuestionnaire({ ...questionnaire, vides: vide });
  };
  const handleOnChangeInexploitable = (newValue: string) => {
    const inexploitables = +newValue;
    Number.isNaN(inexploitables)
      ? setErrorInexploitable(true)
      : setErrorInexploitable(false);
    setQuestionnaire({ ...questionnaire, inexploitables: inexploitables });
  };

  const handleOnChangeDistribuee = (newValue: string) => {
    const distribuee = +newValue;
    // check error
    Number.isNaN(distribuee)
      ? setErrorDistribuee(true)
      : setErrorDistribuee(false);
    // update state du formulaire
    setQuestionnaire({ ...questionnaire, distribuees: distribuee });
  };

  const handleOnChangeExploitable = (newValue: string) => {
    const exploitable = +newValue;
    Number.isNaN(exploitable)
        ? setErrorExploitable(true)
        : setErrorExploitable(false);
    setQuestionnaire({ ...questionnaire, exploitables: exploitable });
  };

  const handleOnSaveSaisiBsc = () => {
    // vérification des error
    if (errorDistribuee || errorInexploitable || errorVide || errorExploitable) {
      console.log("erreur du formulaire saisi BSC");
      //TODO: mettre en place la notification SnackBar pour erreur de saisi
      return;
    }

    console.log(`questionnaire: ${JSON.stringify(questionnaire)}`);

    const newCourse = produce(course, (draft) => {
      if (!(draft.mesure instanceof MesureBsc)) {
        throw new Error("Mesure n'est pas une Mesure BSC");
      }
      draft.mesure.questionnaires = questionnaire;
    });
    dispatch({ type: "update", course: newCourse });

    //TODO: mettre en place la notification avec la SnackBar pour la bonne sauvegarde.
  };

  const handleOnSubmitSaisiBsc = () => {
    handleOnSaveSaisiBsc();

    //TODO: faire la logique de la sousmission
  };

  return (
    <View style={style.container}>
      <Surface style={style.header} mode="elevated" elevation={4}>
        <View style={style.circulation}>
          <CardNumeroLine lineNumber={course.ligne ? course.ligne : "KO"} />

          <Text variant="displaySmall">{course.trainCourse}</Text>
        </View>
        <View style={style.infoCourse}>
          <View style={style.detailTime}>
            <ChronoTopDepart
              depart={course.infoHoraireCourse.datetimeArriveEnq}
              arrival={course.infoHoraireCourse.datetimeDepartEnq}
            />
            <DetailTrajet infoHoraireCourse={course.infoHoraireCourse} />
          </View>
          <MenuBurger course={course} />
        </View>
      </Surface>
      <ScrollView style={style.mainContent}>
        <View style={style.splitScreenVertical}>
          <View style={style.infoTrain}>
            <Text variant="labelMedium">Composition : </Text>
            <Avatar.Text label={infoTrain.composition} size={48} />
            <Text variant="labelMedium">Numéro de matériel :</Text>
            <Text style={style.offsetRight} variant="bodyLarge">
              {infoTrain.numMaterial ? infoTrain.numMaterial : "non renseigné"}
            </Text>
          </View>
          <View style={style.retardTrain}>
            <Text variant="labelMedium">Retard au départ :</Text>
            <Text style={style.offsetRight} variant="bodyLarge">
              {retards.retardDepart === undefined
                ? `0 min`
                : `${retards.retardDepart} min`}
            </Text>
            <Text variant="labelMedium">Retard à l'arrivé :</Text>
            <Text style={style.offsetRight} variant="bodyLarge">
              {retards.retardArrive === undefined
                ? `0 min`
                : `${retards.retardArrive} min`}
            </Text>
          </View>
        </View>
        <View style={style.quotasBsc}>
          <TextInput
            mode="outlined"
            label="Questionnaire distribué : "
            onChangeText={handleOnChangeDistribuee}
            error={errorDistribuee}
            defaultValue={course.mesure.questionnaires?.distribuees.toString()}
            keyboardType="number-pad"
          />
          <TextInput
            mode="outlined"
            label="Questionnaire récupéré vide :"
            onChangeText={handleOnChangeVide}
            error={errorVide}
            defaultValue={course.mesure.questionnaires?.vides.toString()}
            keyboardType="number-pad"
          />
          <TextInput
            mode="outlined"
            label="Questionnaire Inexploitable : "
            onChangeText={handleOnChangeInexploitable}
            error={errorInexploitable}
            defaultValue={course.mesure.questionnaires?.inexploitables.toString()}
            keyboardType="number-pad"
          />
          <TextInput
              mode="outlined"
              label="Questionnaire exploitable :"
              onChangeText={handleOnChangeExploitable}
              error={errorExploitable}
              defaultValue={course.mesure.questionnaires?.exploitables?.toString() ?? "0"}
              keyboardType="number-pad"
          />
        </View>
        <View style={style.areaButton}>
          <Button mode="contained" onPress={handleOnSaveSaisiBsc}>
            Enregister
          </Button>
          <Button mode="contained" onPress={handleOnSubmitSaisiBsc}>
            Soumettre
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
  },
  header: {
    flexDirection: "column",
  },
  circulation: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  infoCourse: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainContent: {
    flexDirection: "column",
    backgroundColor: "white",
  },
  infoTrain: {
    flex: 1,
  },
  retardTrain: {
    flex: 1,
  },
  offsetRight: {
    alignSelf: "flex-end",
  },
  splitScreenVertical: {
    flexDirection: "row",
  },
  quotasBsc: {},
  areaButton: {
    marginVertical: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    bottom: 0,
  },
  detailTime: {
    flexDirection: "row",
    width: 200,
  },
});
