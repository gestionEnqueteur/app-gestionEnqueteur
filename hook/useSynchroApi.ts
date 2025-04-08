import Course from "../models/Course";
import useApi from "../hook/useApi";
import Mesure from "../models/Mesure";
import { useStoreZustand } from "../store/storeZustand";
import courseReducer from "../reducer/courseReducer";
import { useCallback } from "react";

export default function useSynchroApi(): {
  synchroApiPush: () => Promise<void>;
  synchroApiPull: () => Promise<void>;
} {
  const listCourse = useStoreZustand(state => state.courses); 
  const dispatch = useStoreZustand(state => state.dispatchCourse); 
  const courseData = useStoreZustand(state => state.coursesData); 

  const api = useApi();

  console.log("mount useSynchroApi"); 

  const synchroApiPush =  useCallback(async () => {
    
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
        data: {
          mesure: [mesure.convertDataToApi()],
          course: course.id,
        },
      };
      console.log(dataToSend);
      try {
        const responseApi = await api.post(`/api/mesures`, dataToSend);
        coursesIdCourseSynchronised.push(course.id);

        console.log(responseApi);
      } catch (error) {
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
      const response = await api.get(`/api/courses?populate=*`);

      const newListCourse: Course[] = [];
      const coursesToUpdate: Course[] = [];

      //traitement de la réponse
      const listeCourseApiUnknown: unknown[] = response.data.data; // ajout vérification
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

      const newStateCourse = courseReducer(courseData, {
        type: "addAndUpdate",
        newCourses: newListCourse,
        updatedCourses: coursesToUpdate,
      });

      // a la toute fin on met à jour le state en remplacement le state complet.
      dispatch({ type: "load", courses: newStateCourse });
    } catch (error) {
      console.error(`erreur dans le pullSynchro: ${error}`);
      throw error; 
    }
  }, []);

  return { synchroApiPull, synchroApiPush};
}
