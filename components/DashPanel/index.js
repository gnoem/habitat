import styles from "./dashPanel.module.css";
import { useContext, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBacon, faCalendarAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../contexts";
import { useForm } from "../../hooks";
import { Entry } from "../../pages/api";
import Form, { Input, Checkbox, Submit } from "../Form";
import { PageLoading } from "../Loading";

const DashPanel = ({ habits }) => {
  const [panelName, setPanelName] = useState(null);
  const handleNavClick = (newPanelName) => {
    if (panelName === newPanelName) setPanelName(null);
    else setPanelName(newPanelName);
  }
  const isActiveClassName = (name) => {
    if (panelName == null) return '';
    return panelName === name ? styles.active : styles.inactive;
  }
  const isActive = (name) => {
    if (panelName === null) return false;
    return panelName === name;
  }
  return (
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
      <PanelContent {...{ view: panelName, habits }} />
      </div>
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
  const { entries, getEntries } = useContext(DataContext);
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const existingData = useMemo(() => {
    const index = entries?.findIndex(entry => entry.date === currentDate);
    return entries?.[index] ?? null;
  }, [entries, currentDate]);
  const { formData, resetForm, setFormData, inputProps } = useForm({
    userId: 2,
    id: existingData?.id,
    date: existingData?.date ?? currentDate,
    records: existingData?.records ?? []
  });
  useEffect(() => {
    resetForm();
  }, [entries, currentDate]);
  const setRecords = (data) => {
    setFormData(prevData => ({
      ...prevData,
      records: data
    }));
  }
  const updateRecordsArray = (newRecord) => {
    const { records } = formData;
    const arrayToReturn = [...records];
    const { habitId } = newRecord;
    const index = records.findIndex(item => item.habitId === habitId);
    if (index === -1) {
      arrayToReturn.push(newRecord);
    }
    else {
      arrayToReturn[index] = newRecord;
    }
    setRecords(arrayToReturn);
  }
  const handleSubmit = async () => {
    // first getting rid of empty string values for 'amount' field in each record object
    // and replacing them with null
    // otherwise server will reject them for not being type Int
    const formDataCopy = {...formData};
    const updatedRecords = formDataCopy.records.map(record => {
      if (!record.amount) record.amount = null; // covers case 0 and case ''
      return record;
    });
    formDataCopy.records = updatedRecords;
    const submit = existingData ? Entry.edit : Entry.create;
    return submit(formDataCopy);
  }
  const handleSuccess = (result) => {
    const { editEntry, createEntry } = result;
    const newEntry = editEntry ?? createEntry;
    getEntries().then(() => setCurrentDate(newEntry?.date));
    // and then somehow change [editingDate] and [jumpingToDate] to false
    // probably just set useEffect on that component
    // with entire entries array as dependency? i guess.... or maybe currentDate would be better... or both
  }
  if (!habits || !entries) return <PageLoading />;
  return (
    <div className={styles.DataForm}>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess}
            behavior={{ checkmarkStick: false }}
            submit={<Submit value="save changes" cancel={false} className="compact mt15" />}>
        <DataFormDateInput {...{
          existingData,
          formData,
          inputProps,
          currentDate,
          setCurrentDate
        }} />
        <DataFormFields {...{ habits, existingData, currentDate, updateRecordsArray }} />
      </Form>
    </div>
  );
}

const DataFormFields = ({ habits, existingData, currentDate, updateRecordsArray }) => {
  return habits?.map(habit => {
    let record = {};
    if (existingData?.records) {
      const { id } = habit;
      const index = existingData.records.findIndex(item => item.habitId === id);
      record = (index !== -1) ? existingData.records[index] : {};
    }
    return (
      <DataFormField
        key={`dataFormField-habitId-${habit.id}`}
        {...habit}
        {...{ currentDate, record, updateRecordsArray }}
      />
    );
  });
}

const DataFormDateInput = ({ existingData, formData, inputProps, currentDate, setCurrentDate }) => {
  const [editingDate, setEditingDate] = useState(false);
  const [jumpingToDate, setJumpingToDate] = useState(false);
  const inputAttributes = () => {
    let label = 'Edit existing entry for:',
        readOnly = true,
        onClick = () => setEditingDate(true),
        note;
    if (!existingData) {
      label = 'Create a new entry for:';
      readOnly = false;
      onClick = null;
    }
    else if (editingDate) {
      const jumpToDate = () => {
        setJumpingToDate(true);
        setEditingDate(false);
      }
      label = (
        <span>
          Edit the date on this entry:
        </span>
      );
      note = (
        <div className="tar">
          ...or <button type="button" className="link" onClick={jumpToDate}>jump to a different date</button>
        </div>
      );
      readOnly = false;
      onClick = null;
    }
    else if (jumpingToDate) {
      label = (<span>Jump to date:</span>)
      readOnly = false;
      onClick = null;
    }
    return { label, readOnly, onClick, note }
  }
  // todo add useEffect for jumpingToDate - if true, open up calendar box
  // probably can do this when i set up custom calendar component
  useEffect(() => {
    if (editingDate) setEditingDate(false);
    if (jumpingToDate) setJumpingToDate(false);
  }, [currentDate]);
  useEffect(() => {
    // this is for when the user edits the date in the box but then decides they want to jump to the date they typed in
    // if existingData.date !== formData.date (indicates that the user has typed into the box)
    // and then jumpingToDate is set to true, set currentDate equal to formData.date
    if (!jumpingToDate) return;
    if (existingData.date !== formData.date) {
      setCurrentDate(formData.date)
    }
  }, [jumpingToDate])
  const dateInputOnChange = (jumpingToDate || !existingData)
    ? (e) => updateCurrentDate(e.target.value)
    : inputProps.onChange;
  const updateCurrentDate = (date) => {
    setCurrentDate(date);
    setJumpingToDate(false);
  }
  return (
    <Input
      type="date"
      name="date"
      label={inputAttributes().label}
      defaultValue={formData.date}
      readOnly={inputAttributes().readOnly}
      className="stretch mb10"
      {...inputProps}
      onChange={dateInputOnChange}
      onClick={inputAttributes().onClick}
      note={inputAttributes().note}
    />
  );
}

const DataFormField = ({ currentDate, id, icon, label, complex, record, updateRecordsArray }) => {
  const defaultFormData = (record) => ({
    habitId: id,
    amount: record?.amount ?? '',
    check: record?.check ?? false
  });
  const { formData, inputProps, checkboxProps, setFormData } = useForm(defaultFormData(record));
  useEffect(() => {
    setFormData(defaultFormData(record));
  }, [currentDate]);
  useEffect(() => {
    updateRecordsArray(formData);
    // fires on first render and whenever a field is updated
    // so really 'records' gets set twice - first when it's initialized, eithr with existingData?.records ?? []
    // and then again as soon as fields render
  }, [formData.check, formData.amount]);
  useEffect(() => {
    if (!complex) return;
    const parsedInt = (value) => {
      if (isNaN(parseInt(value))) return '';
      return parseInt(value);
    }
    if (!formData.amount || parseInt(formData.amount) === 0) {
      setFormData(prevData => ({
        ...prevData,
        amount: parsedInt(prevData.amount),
        check: false
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        amount: parsedInt(prevData.amount),
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
    const unit = ' ' + label.split('{{')[1].split('}}')[0];
    return (
      <span>
        <div>
          {pre}
          <Input type="number" name="amount" min="0" value={formData.amount} className="inline" {...inputProps} />
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