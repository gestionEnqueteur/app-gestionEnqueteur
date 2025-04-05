import { useEffect, useState } from "react";
import { Avatar } from "react-native-paper";
import { calculDifferenceTime, formatMillisecondsToH_M, formatMillisecondsToMinutes } from "../helpers/timeHelper";


type Props = {
  depart: string;
  arrival: string;
};

export default function ChronoTopDepart(props: Readonly<Props>) {
  const depart = new Date(props.depart);
  const arrival = new Date(props.arrival);
  // state global
  const [output, setOutput] = useState("init");

  //const sixtyMinuteBeforeDeparture = (currentTime: Date) => {
    // 60 minutes avant le départ
    //const deltaBeforeDeparture = calculDifferenceTime(currentTime, depart);
    //setOutput(`${deltaBeforeDeparture.getMinutes()} min`);
  //};

  //const timeBeforeArrival = (currentTime: Date) => {
    //const deltaBeforeArrival = calculDifferenceTime(currentTime, arrival);

    //setOutput(`${deltaBeforeArrival.getHours()}:${deltaBeforeArrival.getMinutes()}`);
  //};

  const displayDate = () => {
    setOutput(`${depart.getDate()}/${depart.getMonth() + 1}`);
  };

  const tick = () => {
    // fonction executer tous les secondes.
    const currentTime = new Date();
    const ONE_HOUR_MS = 60*60*1000; //1h en milliseconde
    const oneHourBeforeDeparture = new Date(
      depart.getTime() - ONE_HOUR_MS);

    // Trop tôt : plus d’1h avant le départ
    if (currentTime.getTime() < oneHourBeforeDeparture.getTime()) {
      setOutput("Trop tôt");
    }

    // 1h avant le départ
    else if (
        currentTime.getTime() >= oneHourBeforeDeparture.getTime() &&
        currentTime.getTime() < depart.getTime()
    ) {
      const delta = calculDifferenceTime(currentTime, depart);
      const minutes = formatMillisecondsToMinutes(delta);
      setOutput(`Départ dans ${minutes} min`);
    }
    // entre départ et arrivée
    else if (
        currentTime.getTime() >= depart.getTime() &&
        currentTime.getTime() <= arrival.getTime()
    ) {
      const delta = calculDifferenceTime(currentTime, arrival);
      setOutput(`Arrivée dans ${formatMillisecondsToH_M(delta)}`);
    }

      //Après l'arrivée
     else {
      displayDate();
    }
  };

  useEffect(() => {
    // iniT
    tick(); //affichage immediat?
    // mise en place du chrono.
    const intervalIdenfier = setInterval(tick, 1000);
    return () => {
      // suppression du setInterval
      clearInterval(intervalIdenfier);
    };
  }, []);

  return (
    <Avatar.Text label={output} size={64} labelStyle={{ fontSize: 16 }} />
  );
}
