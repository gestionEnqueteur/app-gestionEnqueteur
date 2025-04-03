export default interface ApiCourseResponse {
  id: number;
  attributes: {
    mission: string;
    status: "DRAFT";
    ligne: string;
    trainCourse: string;
    objectif: number;
    mesure: string;
    commentaire: string;
    hd: string;
    ha: string;
    placeDeparture: string;
    placeArrival: string;
    updateAt: string; 
  };
};
