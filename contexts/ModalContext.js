import React, { useEffect, useState } from "react";

export const ModalContext = React.createContext(null);

export const ModalContextProvider = ({ children }) => {
  const [modal, setModal] = useState(null);
  const createModal = (keyphrase, options) => {
    setModal({ keyphrase, options });
  }
  const closeModal = () => {
    setModal(prevState => ({
      ...prevState,
      selfDestruct: true
    }));
  }
  useEffect(() => {
    if (modal?.selfDestruct) {
      setTimeout(() => {
        setModal(null);
      }, 200);
    }
  }, [modal?.selfDestruct]);
  return (
    <ModalContext.Provider value={{ modal, createModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}