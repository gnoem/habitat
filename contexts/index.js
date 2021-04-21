import { DataContext, DataContextProvider } from "./DataContext";
import { ModalContext, ModalContextProvider } from "./ModalContext";

const AppContextProvider = ({ children }) => {
  return (
    <DataContextProvider>
      <ModalContextProvider>
        {children}
      </ModalContextProvider>
    </DataContextProvider>
  );
}

export { DataContext, ModalContext, AppContextProvider }