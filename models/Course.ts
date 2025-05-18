import InfoHoraireCourse from "./InfoHoraireCourse";
import { StatusEnum } from "./enum";
import CourseInterface from "./CourseInterface";
import  { courseSchemaApi } from "./ApiCourseResponse";
import Mesure from "./Mesure";
import MesureFactory from "../services/MesureFactory";
import  { enableMapSet, immerable} from "immer"; 

enableMapSet(); 

export default class Course implements CourseInterface{

  static readonly [immerable] = true;

  id!: number;
  mission!: string;
  pds?: string;
  vac?: string;
  affectation?: string;
  infoHoraireCourse!: InfoHoraireCourse;
  status!: StatusEnum;
  ligne?: string;
  service?: string;
  isSynchro!: boolean;
  trainCourse?: string;
  objectif?: number;
  commentaire?: string;
  mesure?: Mesure;
  updatedAt!: string

  constructor(course: CourseInterface) {
    Object.assign(this, course);

    // Création de la mesure 
    if (course.mesure) {
      // mesure existe on le charge
      this.mesure = MesureFactory.loadMesure(course.mesure); 
    }
    else {
      // mesure n'existe pas on crée une mesure vide
      switch(course.mission) {
        case "BSC" : 
          this.mesure = MesureFactory.createMesure("BSC"); 
          break; 
        case "MQ": 
          console.log("mesure MQ à implementer"); 
          break; 
        default: 
          console.log("pas de mesure pour cette mission"); 
      }
    }
  }

  convertDataToApi() {
    const dataTransfert = {
      mission: this.mission,
      trainCourse: this.trainCourse,
      commentaire: this.commentaire,
      ligne: this.ligne,
      status: this.status,
      objectif: this.objectif,
      service: this.service,
      hd: this.infoHoraireCourse?.datetimeDepartEnq,
      ha: this.infoHoraireCourse?.datetimeArriveEnq,
      placeDeparture: this.infoHoraireCourse?.gareDepartEnq,
      placeArrival: this.infoHoraireCourse?.gareArriveEnq,
    }

    return dataTransfert; 
  }

  static createCourseFromApi(dataApi: unknown): Course {
   
    const courseApi = courseSchemaApi.parse(dataApi); 

    const newCourse: CourseInterface = {
      id: courseApi.id,
      mission: courseApi.mission,
      vac: courseApi.vac,
      pds: courseApi.pds,
      ligne: courseApi.ligne,
      trainCourse: courseApi.trainCourse,
      status: StatusEnum.DRAFT, // TODO: a modifié
      objectif: courseApi.objectif,
      isSynchro: true,
      infoHoraireCourse: {
        gareDepartEnq: courseApi.placeDeparture,
        gareArriveEnq: courseApi.placeArrival,
        datetimeDepartEnq: courseApi.hd,
        datetimeArriveEnq: courseApi.ha,
      },
      updatedAt: courseApi.updatadAt
    }

    return new Course(newCourse);

  }
}
