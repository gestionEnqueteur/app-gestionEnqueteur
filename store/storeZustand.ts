import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import Course from '../models/Course'
import courseReducer, { ActionCourse } from '../reducer/courseReducer'
import { SnackbarProps } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CourseInterface from '../models/CourseInterface'

//tout ce qu'on conserve
type StoreState = {
  coursesData: CourseInterface[]; //données brutes persistées
  jwt: string | undefined;
  urlApi: string;
  mainSnackBarProp: SnackbarProps; //proprietés du snackbar
  courses: Course[]; //objet instancié non persisté
  isHydrated: boolean; //AsyncStorage chargé?
}

// fonctions pour modifier le store
type StoreAction = {
  dispatchCourse: (action: ActionCourse) => void;
  setJwt: (token: string) => void;
  setUrlApi: (url: string) => void;
  setMainSnackBarProp: (props: SnackbarProps) => void;
  setIsHydrated: (newValue: boolean) => void;

}


type StoreZustand = StoreState & StoreAction

// pour construire le contenu du store
const functionCreator: StateCreator<StoreZustand> = (set) => ({
      // Courses
    coursesData: [],
    courses: [],

    //ajout ou maj des courses (par le reducer)
    dispatchCourse: (action: ActionCourse) => set((state) => {
      console.log(`appel du dispatch ${action.type}`);
      const updatedCoursesData = courseReducer(state.coursesData, action);
      return {
          coursesData: updatedCoursesData,
          courses: updatedCoursesData.map(item => new Course(item))
        }
    }),

    // Token JWT
    jwt: undefined,
    setJwt: (token: string) => set({ jwt: token }),
    // Hydratation
    isHydrated: false,
    setIsHydrated: (newValue) => set({ isHydrated: newValue}),
    // snackBar
    mainSnackBarProp:
      {
        visible: false,
        children: "Hello World",
        onDismiss: () => console.error("Doit etre redéfini"),
      },
    setMainSnackBarProp: (snackBar: SnackbarProps) => set({ mainSnackBarProp: snackBar }),
    // URL Api
    urlApi: "",
    setUrlApi: (urlApi: string) => set({ urlApi: urlApi }),


}
)

//Zustand a un middleware persist qui utilise AsyncStorage pour sauvegarder certaines données
// même après fermeture de l’app.
export const useStoreZustand = create<StoreZustand>()(
  persist(
    functionCreator,
    {
      name: 'store-zustand',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        coursesData: state.coursesData,
        jwt: state.jwt,
        urlApi: state.urlApi
      }),
      onRehydrateStorage: () => state => {
        console.log("Hydrate Storage");
        if (state?.coursesData) {
          const newCourse = state.coursesData.map(item => new Course(item));
          state.dispatchCourse({type: "load", courses: newCourse});
          state.setIsHydrated(true);

        }
      }

    }
    )
);
