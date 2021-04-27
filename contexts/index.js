import { DataContext, DataContextProvider } from "./DataContext";
import { MobileContext, MobileContextProvider } from "./MobileContext";
import { ModalContext, ModalContextProvider } from "./ModalContext";

const AppContextProvider = ({ children }) => {
  return (
    <DataContextProvider>
      <MobileContextProvider>
        <ModalContextProvider>
          {children}
        </ModalContextProvider>
      </MobileContextProvider>
    </DataContextProvider>
  );
}

export { DataContext, MobileContext, ModalContext, AppContextProvider }