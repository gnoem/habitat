import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef } from "react";
import { ModalContext } from "../../contexts";
import { useRefName } from "../../hooks";
import styles from "./modal.module.css";
import { modalStore } from "./modalStore";

export const Modal = ({ keyphrase, options, selfDestruct }) => {
  const { closeModal } = useContext(ModalContext);
  if (!keyphrase) return null;
  return (
    <ModalWrapper {...{ selfDestruct, closeModal }}>
      {modalStore[keyphrase]?.(options) ?? 'nothing to see here'}
    </ModalWrapper>
  );
}

const ModalWrapper = ({ children, selfDestruct, closeModal }) => {
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  useEffect(() => {
    const modalContent = useRefName(modalContentRef);
    const handleClick = (e) => {
      if (modalContent.contains(e.target)) return;
      closeModal();
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  return (
    <div className={`${styles.Modal} ${selfDestruct ? styles.goodbye : null}`} ref={modalRef}>
      <div className={styles.modalContainer}>
        <div className={styles.modalContent} ref={modalContentRef}>
          <button className={styles.exit} onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></button>
          {children}
        </div>
      </div>
    </div>
  );
}