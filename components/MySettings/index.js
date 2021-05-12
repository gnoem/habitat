import { useContext } from "react";

import styles from "./mySettings.module.css";
import { User } from "../../pages/api";
import { DataContext } from "../../contexts";
import { useForm } from "../../hooks";
import Form, { Dropdown, Submit, Switch } from "../Form";

const MySettings = () => {
  const { user, getUser } = useContext(DataContext);
  const { formData, checkboxProps, dropdownProps } = useForm({
    userId: user.id,
    dashboard__defaultView: user.settings?.dashboard__defaultView ?? 'list',
    habits__defaultView: user.settings?.habits__defaultView ?? 'list',
    appearance__showClock: user.settings?.appearance__showClock ?? true,
    appearance__24hrClock: user.settings?.appearance__24hrClock ?? false,
    appearance__showClockSeconds: user.settings?.appearance__showClockSeconds ?? true
  });
  const handleSubmit = async () => User.editSettings(formData);
  const handleSuccess = () => getUser();
  return (
    <Form
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      behavior={{ checkmarkStick: false }}
      submit={<Submit value="save changes" cancel={false} className="mt25" />}>
        <DashboardSettings {...{ formData, dropdownProps, checkboxProps }} />
    </Form>
  );
}

const DashboardSettings = ({ formData, dropdownProps, checkboxProps }) => {
  const dashboardViewListItems = [
    { value: 'list', display: 'list' },
    { value: 'grid', display: 'grid' },
    { value: 'graph', display: 'graph' }
  ];
  const dashboardViewDefaultValue = dashboardViewListItems.find(item => item.value === formData.dashboard__defaultView)?.display;
  const habitViewListItems = [
    { value: 'list', display: 'list' },
    { value: 'grid', display: 'grid' }
  ];
  const habitViewDefaultValue = dashboardViewListItems.find(item => item.value === formData.habits__defaultView)?.display;
  return (
    <div className={styles.MySettings}>
      <h2>dashboard</h2>
      <div>
        <span>default dashboard view</span>
        <Dropdown
          name="dashboard__defaultView"
          defaultValue={dashboardViewDefaultValue}
          listItems={dashboardViewListItems}
          {...dropdownProps}
        />
      </div>
      <h2>habits</h2>
      <div>
        <span>default habit view</span>
        <Dropdown
          name="habits__defaultView"
          defaultValue={habitViewDefaultValue}
          listItems={habitViewListItems}
          {...dropdownProps}
        />
      </div>
      <h2>appearance</h2>
      <h3>clock</h3>
      <div>
        <span>show clock</span>
        <Switch
          name="appearance__showClock"
          on={formData.appearance__showClock}
          {...checkboxProps}
        />
      </div>
      <div className={formData.appearance__showClock ? '' : styles.disabled}>
        <span>24 hr clock</span>
        <Switch
          name="appearance__24hrClock"
          on={formData.appearance__24hrClock}
          {...checkboxProps}
        />
      </div>
      <div className={formData.appearance__showClock ? '' : styles.disabled}>
        <span>show seconds</span>
        <Switch
          name="appearance__showClockSeconds"
          on={formData.appearance__showClockSeconds}
          {...checkboxProps}
        />
      </div>
    </div>
  );
}

export default MySettings;