import { useStoreZustand } from "../store/storeZustand";
import { StatusEnum } from "../models/enum";

/**
 * Hook pour filtrer et trier les courses valides (pas terminées ou annulées obsolètes).
 */
export default function useCourseCleaner() {
  const courses = useStoreZustand((state) => state.courses);
  const dispatchCourse = useStoreZustand((state) => state.dispatchCourse);

  const now = new Date();

  //si pas de course on stop
  const cleanup = () => {

    const courseToDeleting = courses.filter((course) => {
      const arrival = new Date(course.infoHoraireCourse?.datetimeArriveEnq);
      const dayAfter = new Date(arrival);
      dayAfter.setDate(dayAfter.getDate() + 1);

      // Si la course est annulée ou terminée, elle est affichée uniquement si elle est d'aujourd'hui ou plus récente
      if (
        (course.status === StatusEnum.CANCELED ||
          course.status === StatusEnum.TERMINED) &&
        dayAfter.getTime() >= now.getTime()
      )
        return true;
      return false;
    });


    console.log("test before delete");
    if (courseToDeleting.length === 0) 
      return; 
      

    dispatchCourse({ type: "delete", course: courseToDeleting });
  };

  return { cleanup };
}
