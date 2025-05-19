import { render, RenderOptions, RenderResult } from '@testing-library/react-native'
import { PaperProvider } from 'react-native-paper'
import React, { ReactNode } from 'react'
import { useStoreZustand } from '../store/storeZustand' // ton store existant

// ✅ Type de l'état du store extrait depuis useStoreZustand
type ZustandState = ReturnType<typeof useStoreZustand.getState>

// ✅ Provider personnalisé Zustand + Paper
const AllTheProviders = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <PaperProvider>
      {children}
    </PaperProvider>
  );
};

// ✅ Fonction render personnalisée
const customRender = (
  ui: React.ReactElement,
  options?: RenderOptions
): RenderResult => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

export * from '@testing-library/react-native';
export { customRender as render };

