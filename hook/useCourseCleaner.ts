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
        if (!courses || courses.length === 0) return;

        const filteredCourses = courses.filter((course) => {
            const depart = new Date(course.infoHoraireCourse?.datetimeDepartEnq);

            // Si la course est annulée ou terminée, elle est affichée uniquement si elle est d'aujourd'hui ou plus récente
            if (
                course.status === StatusEnum.CANCELED ||
                course.status === StatusEnum.TERMINED
            ) {
                const dayAfter = new Date(depart);
                dayAfter.setDate(dayAfter.getDate() + 1);
                //on garde que les courses d'aujourd'hui et +1j meme si terminee
                return dayAfter >= now;
            }

            // Si la course est planifiée (DRAFT ou AFFECTED), on garde seulement celles à venir
            if (
                course.status === StatusEnum.DRAFT ||
                course.status === StatusEnum.AFFECTED ||
                course.status === StatusEnum.ASAISIR
            ) {
                return depart >= now;
            }
            //si aucun des cas
            return false;
        });

//on tri avec sort = si a-b est negatif  alors a est avant b , sinon b est avant a
        const sortedCourses = filteredCourses.sort((a, b) =>
            new Date(a.infoHoraireCourse?.datetimeDepartEnq).getTime() -
            new Date(b.infoHoraireCourse?.datetimeDepartEnq).getTime()
        );

        // on envoi les courses filtrées au store Zustand via le dispatch
        // si le composant appel cleanup() le hook s'active
        dispatchCourse({ type: "load", courses: sortedCourses });
    };

    return { cleanup };
}

