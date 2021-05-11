import { useContext } from "react";

import { ModalContext } from "../../../contexts";
import { Button } from "../../../components/Form";

const DeleteAccount = ({ demo, user }) => {
  const { createModal } = useContext(ModalContext);
  const confirmDeleteAccount = () => {
    if (demo) {
      console.log('cute');
      createModal('niceTry');
      return;
    }
    createModal('deleteAccount', { user })
  }
  return (
    <>
      <h2>delete account</h2>
      <p>permanently delete your account, along with all data, habits, and settings. this is <b>irreversible</b>! if you really want to do this, click the button below. (you will be asked to confirm)</p>
      <Button className="compact mt05" onClick={confirmDeleteAccount} disabled={demo}>delete my account</Button>
    </>
  );
}

export default DeleteAccount;