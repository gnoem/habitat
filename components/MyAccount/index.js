import { useContext } from "react";

import { DataContext, MobileContext } from "../../contexts";
import AccountDetails from "./AccountDetails";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";

const MyAccount = () => {
  const isMobile = useContext(MobileContext);
  const { user, demoTokenId } = useContext(DataContext);
  const demo = !!demoTokenId;
  return (
    <>
      {demo && <p><b>note:</b> these forms have been disabled for the demo account - i'm keeping them here so you can see what's going on in this section, but nothing will happen if you try to submit them</p>}
      <AccountDetails {...{ demo, user, isMobile }} />
      <ChangePassword {...{ demo, user, isMobile }} />
      <DeleteAccount {...{ demo, user }} />
    </>
  )
}

export default MyAccount;