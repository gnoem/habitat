import { useContext, useState } from "react";

import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faListOl, faTh } from "@fortawesome/free-solid-svg-icons";

import styles from "./myData.module.css";
import { DataContext, ModalContext } from "../../contexts";
import Timeline from "./Timeline";
import Calendar from "./Calendar";
import Graph from "./Graph";
import ArrowNav from "../ArrowNav";
import ViewOptions from "../ViewOptions";
import { Button, Submit } from "../Form";
import { User } from "../../pages/api";

const MyData = ({ user, habits, entries, calendarPeriod, updateCalendarPeriod, updateDashPanel }) => {
  const [dataView, setDataView] = useState(user.settings?.dashboard__defaultView ?? 'list');
  return (
    <div className={styles.MyData}>
      <MyDataHeader {...{
        calendarPeriod,
        updateCalendarPeriod,
        dataView,
        updateDataView: setDataView
      }} />
      <MyDataContent {...{
        user,
        habits,
        entries,
        calendarPeriod,
        updateDashPanel,
        dataView
      }} />
    </div>
  );
}

const NoData = ({ user, calendarPeriod }) => {
  const { demoTokenId } = useContext(DataContext);
  return (
    <div className={styles.noData}>
      <span>you haven't added any data for this period</span>
      {demoTokenId && <GenerateDemoData {...{ user, calendarPeriod }} />}
    </div>
  );
}

const MyDataHeader = ({ calendarPeriod, updateCalendarPeriod, dataView, updateDataView }) => {
  const currentPeriod = dayjs().format('YYYY-MM');
  const nav = (direction) => () => {
    const newPeriod = direction === 'next'
      ? (period) => dayjs(period).add(1, 'month').format('YYYY-MM')
      : (period) => dayjs(period).subtract(1, 'month').format('YYYY-MM');
    updateCalendarPeriod(newPeriod);
  }
  return (
    <div className={styles.MyDataHeader}>
      <div className={styles.MyDataNav}>
        <ArrowNav ariaLabel="Calendar navigation" prev={nav('prev')} next={nav('next')} />
        {(calendarPeriod !== currentPeriod) &&
          <button
            type="button"
            className={`${styles.jumpToCurrentMonth} link`}
            onClick={() => updateCalendarPeriod(currentPeriod)}>
              jump to current month
          </button>}
      </div>
      <div className={styles.calendarPeriod}>
        {dayjs(calendarPeriod).format('MMMM YYYY')}
        <ViewOptions className={styles.MyDataViewOptions}>
          <button
            className={dataView === 'list' ? styles.currentDataView : ''}
            onClick={() => updateDataView('list')}>
              <FontAwesomeIcon icon={faListOl} />
              list
          </button>
          <button
            className={dataView === 'grid' ? styles.currentDataView : ''}
            onClick={() => updateDataView('grid')}>
              <FontAwesomeIcon icon={faTh} />
              grid
          </button>
          <button
            className={dataView === 'graph' ? styles.currentDataView : ''}
            onClick={() => updateDataView('graph')}>
              <FontAwesomeIcon icon={faChartLine} />
              graph
          </button>
        </ViewOptions>
      </div>
    </div>
  );
}

const MyDataContent = ({ user, habits, entries, calendarPeriod, updateDashPanel, dataView }) => {
  if (!entries.length) return <NoData {...{ user, calendarPeriod }} />;
  const viewShouldInherit = { habits, entries, calendarPeriod, updateDashPanel };
  return (
    <div className={styles.MyDataContent}>
      {(dataView === 'list') && <Timeline {...viewShouldInherit} />}
      {(dataView === 'grid') && <Calendar {...viewShouldInherit} />}
      {(dataView === 'graph') && <Graph {...viewShouldInherit} />}
    </div>
  )
}

const GenerateDemoData = ({ user, calendarPeriod }) => {
  const { demoTokenId, demoGenOption, habits, getHabits, getEntries } = useContext(DataContext);
  const { createModal } = useContext(ModalContext);
  const [successPending, setSuccessPending] = useState(false);
  const generateData = () => {
    setSuccessPending(true);
    return User.generateDemoData({
      id: user.id,
      demoTokenId,
      calendarPeriod,
      alsoHabits: !habits?.length
    }).then(getHabits).then(getEntries);
  }
  const explainDemoData = () => {
    createModal('generateDemoData', { generateData })
  }
  if (!demoGenOption) return null;
  if (habits.length) return (
    <Submit
      value="generate sample data"
      onClick={generateData}
      className="mt15"
      successPending={successPending}
      cancel={false}
    />
  );
  return (
    <center>
      <Button onClick={explainDemoData} className="mt15">
        generate sample data
      </Button>
    </center>
  );
}

export default MyData;