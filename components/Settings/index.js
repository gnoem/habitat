import styles from "./settings.module.css";
import Form, { Submit, Switch } from "../Form";
import { Dropdown } from "../Dropdown";
import { useForm } from "../../hooks";

export const SettingsForm = ({ settings }) => {
  const { formData, updateFormData, checkboxProps } = useForm({
    dashboard__defaultView: settings?.dashboard__defaultView ?? 'list',
    appearance__showClock: settings?.appearance__showClock ?? true,
    appearance__24hrClock: settings?.appearance__24hrClock ?? false,
    appearance__showClockSeconds: settings?.appearance__showClockSeconds ?? true
  });
  const handleSubmit = async () => Promise.resolve(formData);
  const handleSuccess = console.log;
  return (
    <Form
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      behavior={{ checkmarkStick: false }}
      submit={<Submit value="save changes" cancel={false} />}>
        <DashboardSettings {...{ formData, updateFormData }} />
        <AppearanceSettings {...{ formData, updateFormData, checkboxProps }} />
    </Form>
  );
}

const DashboardSettings = () => {
  const dashboardViewListItems = [
    { value: 'list', display: 'list' },
    { value: 'grid', display: 'grid' },
    { value: 'graph', display: 'graph' }
  ];
  return (
    <div className={styles.Settings}>
      <h2>dashboard</h2>
      <div>
        <span>default dashboard view:</span>
        <Dropdown
          defaultValue={dashboardViewListItems[0].display}
          listItems={dashboardViewListItems}
          onChange={console.log}
        />
      </div>
    </div>
  );
}

const AppearanceSettings = ({ formData, checkboxProps }) => {
  return (
    <div className={styles.Settings}>
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
      <div>
        <span>24 hr clock</span>
        <Switch
          name="appearance__24hrClock"
          on={formData.appearance__24hrClock}
          {...checkboxProps}
        />
      </div>
      <div>
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