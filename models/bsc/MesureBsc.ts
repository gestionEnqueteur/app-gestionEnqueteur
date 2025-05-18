import ApiMesureBscResponse from "../ApiMesureBscResponse";
import InfoEnqueteur from "../InfoEnqueteur";
import Mesure from "../Mesure";
import InfoTrain from "./InfoTrain";
import MesureBscInterface from "./MesureBscInterface";
import Perturbation from "./Perturbation";
import Questionnaires from "./Questionnaire";
import Retard from "./Retard";
export default class MesureBsc extends Mesure implements MesureBscInterface {
  infoEnqueteur!: InfoEnqueteur;
  infoTrain!: InfoTrain;
  perturbation?: Perturbation;
  retards!: Retard;
  questionnaires?: Questionnaires;
  commentaireNoSuccess?: string;

  constructor(mesureBsc: MesureBscInterface = {
    infoEnqueteur: {

    },
    infoTrain: {
      composition: "US",
      numMaterial: ""
    },
    retards: {

    },
    type: "BSC"
  }) {
    super(mesureBsc);
  }

  convertDataToApi(): unknown {

    return {
      composition: this.infoTrain.composition,
      numMaterial: this.infoTrain.numMaterial,
      distrbutedQuestionnaire: this.questionnaires?.distribuees,
      emptyQuestionnaire: this.questionnaires?.vides,
      invalidQuestionnaire: this.questionnaires?.inexploitables,
      validQuestionnnaire: this.questionnaires?.exploitables,
      lateDeparture: this.retards.retardDepart,
      lateArrived: this.retards.retardArrive,
      departureStation: this.infoEnqueteur.gareMonteeReel,
      arrivalStation: this.infoEnqueteur.gareDescenteReel
    }
  }
  static createMesureFromApi(dataApi: unknown): MesureBsc {
    if (!this.isValidReponseApi(dataApi)) {
      throw new Error("Format invalide");
    }
    const newMesureInterface: MesureBscInterface = {
      infoEnqueteur: {
        gareMonteeReel: dataApi.attributes.gareMonte,
        gareDescenteReel: dataApi.attributes.gareDescente,
      },
      infoTrain: {
        numMaterial: dataApi.attributes.numMaterial,
        composition: ["US", "UM2", "UM3"].includes(dataApi.attributes.composition)
          ? dataApi.attributes.composition as ("US" | "UM2" | "UM3")
          : "US"
      },
      retards: {
        retardDepart: dataApi.attributes.retardDepart,
        retardArrive: dataApi.attributes.retardArrive
      },
      questionnaires: {
        distribuees: dataApi.attributes.questionnaireDistribuess, 
        vides: dataApi.attributes.questionnaireVides, 
        inexploitables: dataApi.attributes.questionnaireInexploitables
      }, 
      type: dataApi.attributes.__component
    }

    return new MesureBsc(newMesureInterface);
  }

  static isValidReponseApi(dataApi: unknown): dataApi is ApiMesureBscResponse {

    if (
      typeof dataApi === 'object' &&
      dataApi !== null &&
      'id' in dataApi &&
      'attributes' in dataApi &&
      (dataApi as any).attributes.__component === "mesure.mesure-bsc"
    ) return true;
    else return false;

  }

}