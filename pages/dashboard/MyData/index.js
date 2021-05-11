import { useContext, useState } from "react";

import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faListOl, faTh } from "@fortawesome/free-solid-svg-icons";

import styles from "./myData.module.css";
import { User } from "../../api";
import { DataContext } from "../../../contexts";
import { useWarnError } from "../../../hooks";
import Timeline from "./Timeline";
import Calendar from "./Calendar";
import Graph from "./Graph";
import ArrowNav from "../../../components/ArrowNav";
import ViewOptions from "../../../components/ViewOptions";
import { Submit } from "../../../components/Form";
import { PageLoading } from "../../../components/Loading";

const MyData = ({ user, habits, entries, calendarPeriod, updateCalendarPeriod, updateDashPanel }) => {
  const [dataView, setDataView] = useState(user.settings?.dashboard__defaultView ?? 'list');
  return (
    <div className={styles.MyData}>
      <MyDataHeader {...{
        habits,
        entries,
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
  const showButton = user.demoTokenId;
  return (
    <div className={styles.noData}>
      <span>you haven't added any data for this period</span>
      {showButton && <GenerateDemoData {...{ user, calendarPeriod }} />}
    </div>
  );
}

const MyDataHeader = ({ habits, entries, calendarPeriod, updateCalendarPeriod, dataView, updateDataView }) => {
  const { demoTokenId } = useContext(DataContext);
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
      {(demoTokenId && !!habits.length && !!entries.length) && <ClearDemoData {...{ demoTokenId }} />}
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

const ClearDemoData = ({ demoTokenId }) => {
  const [clicked, setClicked] = useState(false);
  const { setHabits, setEntries } = useContext(DataContext);
  const warnError = useWarnError();
  const handleClick = async () => {
    if (clicked) return null;
    setClicked(true);
    return User.clearDemoData({ demoTokenId }).then(() => {
      setHabits(null);
      setEntries(null);
    }).catch(err => {
      warnError('somethingWentWrong', err);
    });
  }
  if (clicked) return <PageLoading className="h125r jcfs mt10" />;
  return (
    <button type="button" className="mt10 link" onClick={handleClick}>
      &raquo; click to clear data / start fresh
    </button>
  );
}

const GenerateDemoData = ({ user, calendarPeriod }) => {
  const { demoTokenId, demoGenOption, habits, getHabits, getEntries } = useContext(DataContext);
  const [successPending, setSuccessPending] = useState(false);
  const handleClick = () => {
    setSuccessPending(true);
    return User.generateDemoData({
      id: user.id,
      demoTokenId,
      calendarPeriod,
      alsoHabits: !habits?.length
    }).then(() => {
      getHabits();
      getEntries();
    });
  }
  if (!demoGenOption) return null;
  return (
    <Submit
      value="click to generate test data"
      onClick={handleClick}
      className="mt15"
      successPending={successPending}
      cancel={false}
    />
  );
}

export default MyData;