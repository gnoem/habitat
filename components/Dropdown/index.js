import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import styles from "./dropdown.module.css";
import { useRefName } from "../../hooks";

export const Dropdown = ({ name, defaultValue, listItems, onChange }) => {
  const [displayValue, setDisplayValue] = useState(defaultValue ?? 'Select one...');
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(state => !state);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const dropdown = useRefName(dropdownRef);
    if (!dropdown) return;
    dropdown.style.width = dropdown.scrollWidth + 'px';
    const closeDropdown = (e) => {
      if (!dropdown.contains(e.target)) {
        setExpanded(false);
      }
    }
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, [dropdownRef]);
  return (
    <div className={`${styles.Dropdown} ${expanded ? styles.expanded : ''}`} ref={dropdownRef}>
      <Display {...{ toggleExpanded }}>{displayValue}</Display>
      <List {...{
        listItems,
        onChange: (value) => onChange(name, value),
        updateDisplayValue: setDisplayValue,
        updateExpanded: setExpanded
      }} />
    </div>
  );
}

const Display = ({ children, toggleExpanded }) => {
  return (
    <div className={styles.Display} onClick={toggleExpanded}>
      <span>{children}</span>
      <FontAwesomeIcon icon={faCaretLeft} />
    </div>
  );
}

const List = ({ listItems, onChange, updateDisplayValue, updateExpanded }) => {
  const listButtons = listItems.map(({ value, display }) => {
    const handleClick = () => {
      onChange(value);
      updateDisplayValue(display);
      updateExpanded(false);
    }
    return (
      <button
        key={`listButtons-display(${display})`}
        type="button"
        onClick={handleClick}>
          <span>{display}</span>
      </button>
    );
  });
  return (
    <div className={styles.List}>
      {listButtons}
    </div>
  );
}