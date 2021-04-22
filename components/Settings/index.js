import styles from "./settings.module.css";
import Form, { Submit } from "../Form";
import { Dropdown } from "../Dropdown";

export const SettingsForm = () => {
  return (
    <Form submit={<Submit value="save changes" cancel={false} />}>
      <DashboardSettings />
      <AppearanceSettings />
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

const AppearanceSettings = () => {
  return (
    <div className={styles.Settings}>
      <h2>appearance</h2>
      <h3>clock</h3>
      <div>
        <span>hide clock</span>
        <div>[y/n]</div>
      </div>
      <div>
        <span>24 hr clock</span>
        <div>[y/n]</div>
      </div>
      <div>
        <span>show seconds</span>
        <div>[y/n]</div>
      </div>
    </div>
  );
}