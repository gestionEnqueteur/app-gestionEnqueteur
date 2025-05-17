import InfoHoraireCourse from "./InfoHoraireCourse";
import Mesure from "./Mesure";
import { StatusEnum } from "./enum";

export default interface CourseInterface {
  id: number;
  mission: string;
  pds?: string;
  vac?: string;
  affectation?: string;
  infoHoraireCourse?: InfoHoraireCourse;
  status: StatusEnum;
  ligne?: string;
  service?: string;
  trainCourse?: string;
  isSynchro: boolean; 
  objectif?: number;
  commentaire?: string;
  mesure?: Mesure;
  updatedAt: string;
}

