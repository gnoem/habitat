import { useContext } from "react";

import { User } from "../../api";
import { DataContext } from "../../../contexts";
import { useForm } from "../../../hooks";
import Form, { Input, Submit } from "../../../components/Form";

const AccountDetails = ({ demo, user, isMobile }) => {
  const { setUser } = useContext(DataContext);
  const { formData, handleFormError, inputProps } = useForm({
    id: user.id,
    name: user.name ?? '',
    email: user.email ?? ''
  });
  const handleSubmit = () => {
    if (demo) {
      console.log('cute');
      return Promise.reject({ __typename: 'NiceTry' });
    }
    return User.edit(formData);
  }
  const handleSuccess = ({ editUser }) => setUser(editUser);
  return (
    <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
          behavior={{ checkmarkStick: false }}
          submit={<Submit value="save changes" cancel={false} className={isMobile ? 'compact mt15' : ''} disabled={demo} />}
          title="account details">
      <Input
        type="text"
        name="name"
        label="your name:"
        defaultValue={formData.name}
        {...inputProps}
        disabled={demo}
      />
      <Input
        type="text"
        name="email"
        label="your email address:"
        defaultValue={formData.email}
        {...inputProps}
        disabled={demo}
      />
    </Form>
  );
}

export default AccountDetails;