import styles from "./dashPanel.module.css";
import dayjs from "dayjs";
import { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "../../hooks";
import { Sidebar } from "../Dashboard";
import Form, { Input, Checkbox, Submit } from "../Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBacon, faCalendarAlt, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { PageLoading } from "../Loading";
import { DataContext } from "../../contexts";
import { handleQuery } from "../../pages/api";

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
        <PanelContent {...{ view: panelName, habits }} />
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
  const { entries, getEntries } = useContext(DataContext);
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const existingData = (() => {
    const index = entries?.findIndex(entry => entry.date === currentDate);
    return entries?.[index] ?? null;
  })();
  const { formData, inputProps } = useForm({
    userId: 2,
    date: existingData?.date ?? currentDate
  });
  const [records, setRecords] = useState(existingData?.records ?? []);
  useEffect(() => {
    setRecords(existingData?.records ?? []);
  }, [currentDate]);
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
  const handleSubmit = async () => {
    const mutation = `
      mutation ($userId: Int, $date: String, $records: [RecordInput]) {
        createEntry(userId: $userId, date: $date, records: $records) {
          id
          date
          records {
            habitId
            amount
            check
          }
        }
      }
    `;
    return await handleQuery(mutation, {...formData, records});
  }
  const handleSuccess = (result) => {
    console.log(result);
    getEntries();
  }
  const fields = habits?.map(habit => {
    let record = {};
    if (existingData?.records) {
      const { id } = habit;
      const index = existingData.records.findIndex(item => item.habitId === id);
      record = (index !== -1) ? existingData.records[index] : {};
    }
    return <DataFormField {...habit} {...{ currentDate, record, updateRecords }} />;
  });
  if (!habits || !entries) return <PageLoading />;
  return (
    <div className={styles.DataForm}>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess}
            behavior={{ checkmarkStick: false }}
            submit={<Submit value="save changes" cancel={false} className="compact" />}>
        <Input
          type="date"
          name="date"
          label={existingData ? 'Edit existing entry for:' : 'Create a new entry for:'}
          defaultValue={formData.date}
          className="stretch"
          {...inputProps}
          onInput={(e) => setCurrentDate(e.target.value)}
        />
        {fields}
      </Form>
    </div>
  );
}

const DataFormField = ({ currentDate, id, icon, label, complex, record, updateRecords }) => {
  const defaultFormData = useMemo(() => ({
    habitId: id,
    amount: record?.amount ?? (complex ? '' : null),
    check: record?.check ?? false
  }), [record]);
  const { formData, inputProps, checkboxProps, setFormData } = useForm(defaultFormData);
  useEffect(() => {
    setFormData(defaultFormData);
  }, [currentDate]);
  useEffect(() => {
    updateRecords(formData);
    // fires on first render and whenever a field is updated
    // so really 'records' gets set twice - first when it's initialized, eithr with existingData?.records ?? []
    // and then again as soon as fields render
  }, [formData.check]);
  useEffect(() => {
    if (!complex) return;
    const parsedInt = (value) => {
      if (isNaN(parseInt(value))) return null;
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