import { DataContext, DataContextProvider } from "./DataContext";
import { MobileContext, MobileContextProvider } from "./MobileContext";
import { ModalContext, ModalContextProvider } from "./ModalContext";

const AppContextProvider = ({ children }) => {
  return (
    <MobileContextProvider>
      <ModalContextProvider>
        {children}
      </ModalContextProvider>
    </MobileContextProvider>
  );
}

export { DataContext, MobileContext, ModalContext, DataContextProvider, AppContextProvider }