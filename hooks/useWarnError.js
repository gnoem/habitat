import { useContext } from "react";
import { ModalContext } from "../contexts";

export const useWarnError = () => {
  const createModal = useContext(ModalContext);
  return (type = 'somethingWentWrong', error = {}) => createModal(type, { error });
}