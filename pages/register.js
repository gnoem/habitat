import { useState } from "react";

import { RegistrationIsOpen, RegistrationIsClosed } from "../components/Registration";

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