import Course from "../../models/Course";
import CourseInterface from "../../models/CourseInterface";
import { StatusEnum } from "../../models/enum";
import TestMock from "../../services/TestMock";



describe("Test la class Course", () => {
  
  const courseInterface: CourseInterface | undefined = TestMock.getCourses().find(
    (course) => course.mission === "BSC HDF"
  );

  if (courseInterface === undefined) {
    throw new Error("pas de course dans le mock"); 
  }


  const course = new Course(courseInterface); 

  test('course est une instance de Course', () => {
    expect(course).toBeInstanceOf(Course); 
  })

  test("test error avec dataApi incorrect sur createCourseFromApi", () => { 
    expect(() => {
      Course.createCourseFromApi("data incorrect");
    }).toThrow("Format incorrect"); 
  }); 

  test("test création from Api createCourseFromApi", () => {
    const dataApi = {
      id: 69, 
      attributes: {
        mission: "BSC HDF", 
        ligne: "K12", 
        trainCourse: "16420", 
        objectif: 80, 
        placeDeparture: "LONGUEAU", 
        placeArrival: "PARIS", 
        hd: "string", 
        ha: "string", 
        status: "TEST", 
        commentaire: "un test"
      }
    }

    const courseTest = Course.createCourseFromApi(dataApi); 

    expect(courseTest).toBeInstanceOf(Course); 
  }); 

  test("test de convertDataToApi", () => {

    const courseInterfaceTest: CourseInterface = {
      id: 42,
      mission: "BSC HDF",
      trainCourse: "16420", 
      objectif: 69, 
      pds: "LLF",
      vac: "test",
      status: StatusEnum.DRAFT,
      isSynchro: false, 
      updatedAt: "fake Date" //a modifier
    }

    const courseTest = new Course(courseInterfaceTest); 
    const dataToSend = courseTest.convertDataToApi(); 

    expect(dataToSend.mission).toBe("BSC HDF"); 
    expect(dataToSend.trainCourse).toBe("16420"); 
    expect(dataToSend.objectif).toBe(69); 
  })



  
})
