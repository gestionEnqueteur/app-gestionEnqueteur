import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import Course from '../models/Course'
import courseReducer, { ActionCourse } from '../reducer/courseReducer'

import { SnackbarProps } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CourseInterface from '../models/CourseInterface'

type StoreState = {
  coursesData: CourseInterface[];
  jwt: string | undefined;
  urlApi: string;
  mainSnackBarProp: SnackbarProps;
  courses: Course[];
  isHydrated: boolean; 
}

type StoreAction = {
  dispatchCourse: (action: ActionCourse) => void;
  setJwt: (token: string | undefined) => void;
  setUrlApi: (url: string) => void;
  setMainSnackBarProp: (props: SnackbarProps) => void;
  setIsHydrated: (newValue: boolean) => void; 
}


type StoreZustand = StoreState & StoreAction

const functionCreator: StateCreator<StoreZustand> = (set) => ({
  // Courses 
  coursesData: [],
  courses: [],
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
  setJwt: (token: string | undefined) => set({ jwt: token }),
  // Hydratation
  isHydrated: false, 
  setIsHydrated: (newValue) => set({ isHydrated: newValue}), 
  // snackBar 
  mainSnackBarProp:
  {
    visible: false,
    children: "Hello World",
    onDismiss: () => console.error("Doit etre redéfinir"),
  },
  setMainSnackBarProp: (snackBar: SnackbarProps) => set({ mainSnackBarProp: snackBar }),
  // URL Api 
  urlApi: "",
  setUrlApi: (urlApi: string) => set({ urlApi: urlApi }),
}
)

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
