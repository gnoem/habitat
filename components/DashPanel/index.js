import styles from "./dashPanel.module.css";
import { useEffect, useState } from "react";
import { useForm } from "../../hooks";
import { Sidebar } from "../Dashboard";
import Form, { Input, Checkbox, Submit } from "../Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBacon, faCalendarAlt, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { PageLoading } from "../Loading";

const DashPanel = ({ habits }) => {
  const [view, setView] = useState(null);
  const handleNavClick = (newView) => {
    if (view === newView) setView(null);
    else setView(newView);
  }
  const isActiveClassName = (name) => {
    if (view == null) return '';
    return view === name ? styles.active : styles.inactive;
  }
  const isActive = (name) => {
    if (view === null) return false;
    return view === name;
  }
  return (
    <Sidebar>
        <div className={styles.DashPanel}>
          <nav>
            <button className={isActiveClassName('data')} onClick={() => handleNavClick('data')}>
              <span>Add data</span>
              <span><FontAwesomeIcon icon={faPlus} /></span>
            </button>
            <button className={isActiveClassName('calendar')} onClick={() => handleNavClick('calendar')}>
              <span>Jump to date</span>
              <span><FontAwesomeIcon icon={isActive('calendar') ? faPlus : faCalendarAlt} /></span>
            </button>
            <button className={isActiveClassName('test')} onClick={() => handleNavClick('test')}>
              <span>Dummy</span>
              <span><FontAwesomeIcon icon={isActive('test') ? faPlus : faBacon} /></span>
            </button>
          </nav>
        <PanelContent {...{ view, habits }} />
        </div>
    </Sidebar>
  );
}

const PanelContent = ({ view, habits }) => {
  const panelContent = () => {
    switch (view) {
      case 'data': return <DataForm {...{ habits }} />;
      case 'calendar': return 'Jump to date...';
      case 'test': return 'test';
      default: return '';
    }
  }
  return (
    <div className={`${styles.PanelContent} ${view ? styles.active : ''}`}>
      {panelContent()}
    </div>
  );
}

const DataForm = ({ habits }) => {
  // get data; if data exists for current date (DashPanel level state, possibly higher), it'll be passed to DataForm as 'existingData'
  const existingData = { // sample data
    date: '2021-04-20',
    records: [ /* this will initially be an array of string/int IDs that each correspond to a row in the 'Record' db table
    which will then be used to query the db again to retrieve that information? or actually doesn't graphQL let you skip the round trip and just get all the info at once?? i think so right?
    in any case the data's probably going to be a mess when it gets here so these objects will have to be prepared/packaged behind the scenes as soon as the data is fetched from the server and then made available via const { data } = useContext or whatever
    and probably should look pretty much like this, i like this  */
      { habitId: 1, amount: 64, check: true },
      { habitId: 5, amount: null, check: true }
    ]
  }
  const { formData, inputProps } = useForm({
    userId: 2,
    date: existingData?.date ?? ''
  });
  // when submitting, first will create entry and get the new ID back, then add that ID to each record?
  const [records, setRecords] = useState(existingData?.records ?? []);
  const updateRecords = (newRecord) => {
    setRecords(prevArray => {
      const arrayToReturn = [...prevArray];
      const { habitId } = newRecord;
      const index = prevArray.findIndex(item => item.habitId === habitId);
      if (index === -1) {
        arrayToReturn.push(newRecord);
        return arrayToReturn;
      }
      arrayToReturn[index] = newRecord;
      return arrayToReturn;
    });
  }
  const handleSubmit = () => {
    console.log(formData);
    console.log(records);
    return Promise.resolve('nice');
  }
  const handleSuccess = () => {
    return;
  }
  const fields = habits?.map(habit => {
    let record = {};
    if (existingData?.records) {
      const { id } = habit;
      const index = existingData.records.findIndex(item => item.habitId === id);
      record = (index !== -1) ? existingData.records[index] : {};
    }
    return <DataFormField {...habit} {...{ record, updateRecords }} />;
  });
  if (!habits) return <PageLoading />;
  return (
    <div className={styles.DataForm}>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess} behavior={{ checkmarkStick: false }} submit={<Submit className="compact" cancel={false} />}>
        <Input
          type="date"
          name="date"
          label={existingData ? 'Edit existing data for:' : 'Add new data for:'}
          defaultValue={formData.date}
          className="stretch" {...inputProps}
        />
        {fields}
      </Form>
    </div>
  );
}

const DataFormField = ({ id, icon, label, complex, record, updateRecords }) => {
  const { formData, inputProps, checkboxProps, setFormData } = useForm({
    habitId: id,
    amount: record?.amount ?? null,
    check: record?.check ?? false
  });
  useEffect(() => {
    updateRecords(formData);
    // fires on first render and whenever a field is updated
    // so really 'records' gets set twice - first when it's initialized, eithr with existingData?.records ?? []
    // and then again as soon as fields render
  }, [formData.check]);
  useEffect(() => {
    if (!complex) return;
    if (!formData.amount || parseInt(formData.amount) === 0) {
      setFormData(prevData => ({
        ...prevData,
        check: false
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        check: true
      }));
    }
  }, [formData.amount]);
  return (
    <div className={styles.DataFormField}>
      <span className={formData.check ? styles.check : ''}>{icon}</span>
      <DataFormFieldInput {...{ id, label, complex, formData, inputProps, checkboxProps }} />
    </div>
  );
}

const DataFormFieldInput = ({ label, complex, formData, inputProps, checkboxProps }) => {
  if (complex) {
    const pre = label.split('{{')[0];
    const post = label.split('}}')[1];
    const unit = label.split('{{')[1].split('}}')[0];
    return (
      <span>
        <div>
          {pre}
          <Input type="number" name="amount" min="0" defaultValue={formData.amount} className="inline" {...inputProps} />
          {unit}
          {post}
        </div>
      </span>
    );
  }
  return (
    <span>
      <Checkbox name="check" label={label} checked={formData.check} checkboxAfter={true} {...checkboxProps} />
    </span>
  );
}

export default DashPanel;