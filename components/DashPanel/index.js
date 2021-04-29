import styles from "./dashPanel.module.css";
import { useContext, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight, faCalendarAlt, faCaretRight, faPlus, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { DataContext, MobileContext, ModalContext } from "../../contexts";
import { useForm } from "../../hooks";
import { Entry } from "../../pages/api";
import Form, { Input, Checkbox, Submit, Button } from "../Form";
import { PageLoading } from "../Loading";
import { ArrowNav } from "../ArrowNav";
import { getUnitFromLabel } from "../../utils";
import { useRouter } from "next/router";

const DashPanel = ({ habits, dashPanel, updateDashPanel }) => {
  //const [panelName, setPanelName] = useState(null);
  const { view: panelName, options: dashPanelOptions } = dashPanel ?? {};
  const handleNavClick = (newPanelName) => {
    if (panelName === newPanelName) updateDashPanel(null);
    else updateDashPanel(newPanelName);
  }
  const isActiveClassName = (name) => {
    if (panelName == null) return '';
    return panelName === name ? styles.active : styles.inactive;
  }
  const isActive = (name) => {
    if (panelName == null) return false;
    return panelName === name;
  }
  return (
    <div className={styles.DashPanel}>
      <nav aria-label="Dashboard actions" className={(panelName == null) ? '' : styles.active}>
        <button className={isActiveClassName('data')} onClick={() => handleNavClick('data')}>
          <span>Add data</span>
          <span><FontAwesomeIcon icon={faPlus} /></span>
        </button>
        <button className={isActiveClassName('calendar')} onClick={() => handleNavClick('calendar')}>
          <span>Jump to...</span>
          <span><FontAwesomeIcon icon={isActive('calendar') ? faPlus : faCalendarAlt} /></span>
        </button>
      </nav>
      <PanelContent {...{
        view: panelName,
        dashPanelOptions,
        habits,
        updateDashPanel
      }} />
      </div>
  );
}

const PanelContent = ({ view, habits, dashPanelOptions, updateDashPanel }) => {
  return (
    <div className={`${styles.PanelContent} ${view ? styles.active : ''}`}>
      {(view === 'data') && <DataForm {...{ habits, dashPanelOptions, updateDashPanel }} />}
      {(view === 'calendar') && <PanelCalendar />}
    </div>
  );
}

const DataForm = ({ habits, dashPanelOptions, updateDashPanel }) => {
  const router = useRouter();
  const { user, entries, getEntries } = useContext(DataContext);
  const isMobile = useContext(MobileContext);
  const { createModal } = useContext(ModalContext);
  const [currentDate, setCurrentDate] = useState(dashPanelOptions?.date ?? dayjs().format('YYYY-MM-DD'));
  const existingData = useMemo(() => {
    const index = entries?.findIndex(entry => entry.date === currentDate);
    return entries?.[index] ?? null;
  }, [entries, currentDate]);
  const { formData, resetForm, setFormData, inputProps } = useForm({
    userId: user.id,
    id: existingData?.id,
    date: existingData?.date ?? currentDate,
    records: existingData?.records ?? []
  });
  useEffect(() => {
    if (dashPanelOptions?.date) setCurrentDate(dashPanelOptions?.date);
  }, [dashPanelOptions?.date]);
  useEffect(() => {
    resetForm();
  }, [entries, currentDate, existingData]);
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
    setFormData(prevData => ({
      ...prevData,
      records: arrayToReturn
    }))
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
    // todo deal with this
    if (isMobile) updateDashPanel(null);
  }
  const handleDelete = () => {
    createModal('deleteEntry', { entry: existingData });
  }
  if (!habits || !entries) return <PageLoading />;
  if (!habits.length) return (
    <center className={styles.noHabits}>
      <p>you're not tracking any habits yet!</p>
      <Button className="compact" onClick={() => router.push('/habits')}>add your first habit</Button>
    </center>
  );
  return (
    <div className={styles.DataForm}>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess}
            behavior={{ checkmarkStick: false }}
            submit={<Submit value="save changes" cancel={false} className="compact mt15" />}>
        <DataFormDateInput {...{
          existingData,
          formData,
          setFormData,
          inputProps,
          currentDate,
          setCurrentDate
        }} />
        <DataFormFields {...{ habits, existingData, currentDate, updateRecordsArray }} />
      </Form>
      {existingData && (
        <button className={styles.deleteEntry} onClick={handleDelete}>
          <FontAwesomeIcon icon={faAngleDoubleRight} />
          <span>delete this entry</span>
        </button>
      )}
    </div>
  );
}

const DataFormFields = ({ habits, existingData, currentDate, updateRecordsArray }) => {
  return habits?.map(habit => {
    let record;
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

const DataFormDateInput = ({ existingData, formData, setFormData, inputProps, currentDate, setCurrentDate }) => {
  const [editingDate, setEditingDate] = useState(false);
  const [jumpingToDate, setJumpingToDate] = useState(false);
  const navDate = (direction) => () => {
    const newDate = direction === 'next'
      ? (date) => dayjs(date).add(1, 'day').format('YYYY-MM-DD')
      : (date) => dayjs(date).subtract(1, 'day').format('YYYY-MM-DD');
    updateCurrentDate(newDate);
  }
  const inputAttributes = () => {
    let label = <span>Edit existing entry for:</span>,
        nav = (
          <ArrowNav
            ariaLabel="Date navigation for adding data"
            prev={navDate('prev')}
            next={navDate('next')}
            className={styles.DataFormDateInputNav}
          />
        ),
        readOnly = true,
        onClick = () => setEditingDate(true),
        note;
    if (!existingData) {
      label = <span>Create a new entry for:</span>;
      readOnly = false;
      onClick = null;
    }
    else if (editingDate) {
      const jumpToDate = () => {
        setJumpingToDate(true);
        setEditingDate(false);
      }
      const cancelEditingDate = () => {
        setFormData(prevState => ({
          ...prevState,
          date: existingData?.date
        }));
        setEditingDate(false);
      }
      label = <span>Edit the date on this entry:</span>;
      note = (
        <div className="tar">
          ...or <button type="button" className="link" onClick={jumpToDate}>jump to date</button> / <button type="button" onClick={cancelEditingDate}><FontAwesomeIcon icon={faTimesCircle} /></button>
        </div>
      );
      nav = null;
      readOnly = false;
      onClick = null;
    }
    else if (jumpingToDate) {
      label = <span>Jump to date:</span>;
      readOnly = false;
      nav = null;
      onClick = null;
    }
    return { label: (<>{label} {nav}</>), readOnly, onClick, note }
  }
  // todo add useEffect for jumpingToDate - if true, open up calendar box
  // probably can do this when i set up custom calendar component
  // ALSO!!!! if creating new entry BUT changes have been made to form, then changing the date should not jump to a new date and erase the changes
  // id-less but edited formData should be treated similarly to existingData in this respect
  // maybe instead of "if (!existingData)" in inputAttributes fn, it should check if formData.id == null
  // and then set a useEffect on FormFieldInput where if any change is made, set formData.id to 'pending' or something
  // also the label should still say "create a new entry for:" and not "edit existing entry" or whatever
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
  }, [jumpingToDate]);
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
      value={formData.date}
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
  const { formData, inputProps, checkboxProps, setFormData, resetForm } = useForm({
    habitId: id,
    amount: record?.amount ?? '',
    check: record?.check ?? false
  });
  useEffect(() => {
    resetForm();
  }, [currentDate]);
  useEffect(() => {
    if (!record) resetForm();
  }, [record]);
  useEffect(() => {
    updateRecordsArray(formData); // immediately update parent formData with this record
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
    const unit = ' ' + getUnitFromLabel(label);
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

const PanelCalendar = () => {
  return (
    <div className={styles.PanelCalendar}>
      Jump to date...
    </div>
  )
}

export default DashPanel;