import ApiMesureBscResponse from "../../models/ApiMesureBscResponse";
import MesureBsc from "../../models/bsc/MesureBsc";
import MesureBscInterface from "../../models/bsc/MesureBscInterface";
import Mesure from "../../models/Mesure";
import MesureInterface from "../../models/MesureInterface";
import MesureFactory from "../../services/MesureFactory";

describe("test de MesureFactory", () => {
  // data global pour les test : 
  const dataApi: ApiMesureBscResponse = {
    id: 0,
    attributes: {
      id: 0,
      __component: "mesure.mesure-bsc",
      composition: "US",
      numMaterial: "B8260",
      questionnaireDistribuess: 90,
      questionnaireVides: 5,
      questionnaireInexploitables: 4,
      questionnaireExploitables: 86,
      retardDepart: 5,
      retardArrive: 10,
      gareMonte: "LONGUEAU",
      gareDescente: "PARIS"
    }
  }


  test("création d'une mesure BSC", () => {
    const mesureBsc = MesureFactory.createMesure("BSC");

    expect(mesureBsc).toBeInstanceOf(MesureBsc);
  });

  test("load d'une mesureBsc", () => {
    const interfaceTest: MesureBscInterface = {
      type: "BSC",
      infoEnqueteur: {},
      infoTrain: {
        composition: "UM2",
        numMaterial: "TGV Duplex",
      },
      retards: {
        retardDepart: 5,
        retardArrive: 30,
      },
      questionnaires: {
        distribuees: 80,
        vides: 5,
        inexploitables: 5,
      },
    };

    const mesureTest = MesureFactory.loadMesure(interfaceTest);

    expect(mesureTest).toBeInstanceOf(Mesure);
    expect(mesureTest).toBeInstanceOf(MesureBsc);

    // test des valeurs
    if (!(mesureTest instanceof MesureBsc)) {
      throw new Error("mesure test n'est pas une MesureBsc");
    }

    expect(mesureTest.infoTrain.numMaterial).toBe("TGV Duplex");
    expect(mesureTest.infoTrain.composition).toBe("UM2");
    expect(mesureTest.questionnaires).toMatchObject({
      distribuees: 80,
      vides: 5,
      inexploitables: 5,
    });
    expect(mesureTest.retards).toMatchObject({
      retardDepart: 5,
      retardArrive: 30,
    });
  });

  test("doit lever une erreur sur type inconnu sur la méthode loadMesure", () => {
    const interfaceTest: MesureInterface = {
      type: "OVNI",
    };

    expect(() => {
      MesureFactory.loadMesure(interfaceTest);
    }).toThrow();
  });

  test("doit lever une erreur sur type inconnu sur la méthode createMesure", () => {
    expect(() => { MesureFactory.createMesure("OVNI")}).toThrow(); 
  })

  test("creation mesure depuis les data API", () => {
    const dataApi: ApiMesureBscResponse = {
      id: 0,
      attributes: {
        id: 0,
        __component: "mesure.mesure-bsc",
        composition: "US",
        numMaterial: "B8260",
        questionnaireDistribuess: 90,
        questionnaireVides: 5,
        questionnaireInexploitables: 4,
        questionnaireExploitables: 86,
        retardDepart: 5,
        retardArrive: 10,
        gareMonte: "LONGUEAU",
        gareDescente: "PARIS"
      }
    }

    const mesureTest = MesureFactory.createMesureFromApi(dataApi); 

    expect(mesureTest).toBeInstanceOf(Mesure); 
    expect(mesureTest).toBeInstanceOf(MesureBsc); 

    if(!(mesureTest instanceof MesureBsc)) {
      throw new Error("mesureTest n'est pas une mesure BSC"); 
    }

    // test des attributs 
    expect(mesureTest.infoEnqueteur.gareMonteeReel).toBe("LONGUEAU"); 
    expect(mesureTest.infoEnqueteur.gareDescenteReel).toBe("PARIS"); 
    expect(mesureTest.retards.retardDepart).toBe(5); 
    expect(mesureTest.retards.retardArrive).toBe(10); 
    expect(mesureTest.questionnaires?.distribuees).toBe(90); 
    expect(mesureTest.questionnaires?.vides).toBe(5); 
    expect(mesureTest.questionnaires?.inexploitables).toBe(4); 
    // expect(mesureTest.questionnaires?.exploitables).toBe(86); 
    expect(mesureTest.infoTrain.numMaterial).toBe("B8260"); 
  }); 

  test("test error sur data invalide pour createMesureFromApi", () => {

    expect(() => { MesureFactory.createMesureFromApi("data invalide")}).toThrow("Type invalide"); 
  })
});
