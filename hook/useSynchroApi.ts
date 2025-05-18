import Course from "../models/Course";
import useApi from "../hook/useApi";
import Mesure from "../models/Mesure";
import { useStoreZustand } from "../store/storeZustand";
import { useCallback } from "react";
import { AxiosError, AxiosResponse } from "axios";

export default function useSynchroApi(): {
  synchroApiPush: () => Promise<void>;
  synchroApiPull: () => Promise<void>;
} {
  const listCourse = useStoreZustand(state => state.courses);
  const dispatch = useStoreZustand(state => state.dispatchCourse);

  const api = useApi();

  console.log("mount useSynchroApi");

  const synchroApiPush = useCallback(async () => {

    console.log("appel de synchroApiPush");

    // Envoi des mesures
    const coursesNotSynchronised = listCourse.filter(
      (course) => course.isSynchro === false
    );
    const coursesIdCourseSynchronised: number[] = [];

    for (const course of coursesNotSynchronised) {
      const mesure: Mesure | undefined = course.mesure;

      if (!mesure) continue;

      const dataToSend = {
        mesureBsc: mesure.type === "BSC" ? mesure.convertDataToApi() : undefined,
        mesureMq: mesure.type === "MQ" ? mesure.convertDataToApi() : undefined,
        courseId: course.id,
        type: course.mission
      };
      console.log(dataToSend);
      try {
        const responseApi = await api.post(`/enq/mesures`, dataToSend);
        coursesIdCourseSynchronised.push(course.id);

        console.log(responseApi);
      } catch (error) {

        if(error instanceof AxiosError) {
          console.log("erreur détaillé"); 
          console.log(error.response?.data); 
        }
        console.error(`erreur dans SynchroApiPush:  ${error}`);
        // on renvoie l'erreur plus haut
        throw error;
      }
    }

    // passage de isSynchro a true pour les courses synchronisé
    dispatch({ type: "synchro", coursesId: coursesIdCourseSynchronised });
  }, []);

  const synchroApiPull = useCallback(async () => {

    console.log("appel de synchroApiPull");

    try {
      console.log(`pull data from API`);
      //TODO: par la suite, récuperer que les data de l'utilisateur
      const response = await api.get<AxiosResponse>(`/enq/courses`);
      console.log(response.data);
      const newListCourse: Course[] = [];
      const coursesToUpdate: Course[] = [];

      //traitement de la réponse
      if (!(response.data instanceof Array)) throw new Error("API ne donne pas le bon format (array) ");

      const listeCourseApiUnknown: unknown[] = response.data; // ajout vérification
      // on itère sur les items de API
      for (const responseBrute of listeCourseApiUnknown) {
        // on essaye de les transformer en course
        const courseFromApi = Course.createCourseFromApi(responseBrute);
        const courseFromZustand = listCourse.find(
          (item) => courseFromApi.id === item.id
        );

        if (courseFromZustand) {
          // objet n'existe on vérifie la date de mise a jour
          if (courseFromZustand.updatedAt !== courseFromApi.updatedAt) {
            // les date ne sont pas synchro, on le met dans la liste des course a updater
            coursesToUpdate.push(courseFromApi);
          }
        } else {
          // la course n'est pas dans le store Zustand, on le rajoute dans la liste
          courseFromApi.isSynchro = true;
          newListCourse.push(courseFromApi);
        }
      }

      // a la toute fin on met à jour le state en remplacement le state complet.
      dispatch({ type: "addAndUpdate", newCourses: newListCourse, updatedCourses: coursesToUpdate });
    } catch (error) {
      console.error(`erreur dans le pullSynchro: ${error}`);
      throw error;
    }
  }, []);

  return { synchroApiPull, synchroApiPush };
}
