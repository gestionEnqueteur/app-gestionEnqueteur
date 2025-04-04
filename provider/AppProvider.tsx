import React, { ReactNode, useEffect } from "react";
import LoadingScreen from "../screens/LoadingScreen";
import { useStoreZustand } from "../store/storeZustand";
import LoginScreen from "../screens/LoginScreen";

type Props = {
  children: ReactNode;
};

export default function AppProvider(props: Readonly<Props>) {
  
  const isHydrated = useStoreZustand(state => state.isHydrated);
  const jwt = useStoreZustand(state => state.jwt);  

  
  console.log("mount AppProvider");
  
  useEffect(() => {
    // chargement des courses
    console.log("useEffect AppProvider");

    return () => {
      console.log("unmount AppProvider");
    };
  }, []);


  
  if (!isHydrated) {
    return <LoadingScreen/>
  }

  if (!jwt) {
    return <LoginScreen />
  }
  return <>{props.children}</>;
}
