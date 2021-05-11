import { useState } from "react";

import RegistrationIsClosed from "./RegistrationIsClosed";
import RegistrationIsOpen from "./RegistrationIsOpen";

const Register = () => {
  const [token, setToken] = useState(null);
  return (
    <>
      <h2>register</h2>
      {token
        ? <RegistrationIsOpen {...{ token }} />
        : <RegistrationIsClosed {...{ updateToken: setToken }} />
      }
    </>
  );
}

export default Register;