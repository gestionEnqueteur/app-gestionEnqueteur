import CourseInterface from "../models/CourseInterface";

export type ActionCourse =
  | { type: "update"; course: CourseInterface }
  | { type: "delete"; course: CourseInterface }
  | { type: "add"; course: CourseInterface | CourseInterface[] }
  | { type: "load"; courses: CourseInterface[] }
  | { type: "synchro"; coursesId: number[] }
  | { type: "reset" }
  | { type: "updateApi"; courses: CourseInterface[] };

export default function courseReducer(
  state: CourseInterface[],
  action: ActionCourse
) {
  let newState: CourseInterface[];

  switch (action.type) {
    case "add":
      console.log("Reducer: add"); 
      newState = addCourse(state, action.course);
      return newState;

    case "delete":
      newState = state.filter((item) => item.id !== action.course.id);
      return newState;

    case "update":
      newState = state.map((item) =>
        item.id === action.course.id
          ? { ...action.course, isSynchro: false }
          : item
      );
      console.log("action update");
      return newState;

    case "updateApi":
        console.log("Reducer : updateAPI"); 
        newState = state; 
      for (let course of action.courses) {
        newState = state.map((item) => (item.id === course.id ? course : item));
      }
      return newState;

    case "load":
      console.log("Reducer: load"); 
      newState = action.courses;
      return newState;

    case "synchro":
      newState = state.map((item) =>
        action.coursesId.includes(item.id) ? { ...item, isSynchro: true } : item
      );
      return newState;

    case "reset":
      newState = [];
      return newState;

    default:
      return state;
  }
}

// méthode interne pour le reducer
function addCourse(
  prevState: CourseInterface[],
  courses: CourseInterface | CourseInterface[]
) {
  // on vérifie le type
  if (courses instanceof Array) {
    // c'est un array
    const newListCourse: CourseInterface[] = [];
    // vérification des doublon
    for (const course of courses) {
      if (prevState.find((item) => item.id === course.id) === undefined) {
        newListCourse.push(course);
      }
    }
    return [...prevState, ...newListCourse];
  } else if (prevState.find((item) => item.id === courses.id) === undefined) {
    return [...prevState, courses];
  }
  console.warn("duplication ID");
  return prevState;
}
