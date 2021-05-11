import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import styles from "./emojiPicker.module.css";

const EmojiPickerNoSSRWrapper = dynamic(
  () => import("emoji-picker-react"),
  {
    ssr: false,
    loading: () => <aside className={styles.loading}>Loading...</aside>,
  }
);

const EmojiPicker = ({ setFormData }) => {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);
  const toggleExpanded = () => {
    if (expanded) setExpanded('closing');
    else setExpanded(true);
  }
  useEffect(() => {
    if (!expanded) return;
    if (expanded === 'closing') {
      setTimeout(() => {
        setExpanded(false)
      }, 200);
    }
    const closePicker = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        console.log('thats whats up');
        setExpanded('closing');
      }
    }
    window.addEventListener('click', closePicker);
    return () => window.removeEventListener('click', closePicker);
  }, [expanded]);
  const handleClick = (_, obj) => {
    setExpanded('closing');
    setFormData(prevData => ({
      ...prevData,
      icon: obj.emoji
    }));
  }
  return (
    <div className={`${styles.EmojiPicker} ${expanded ? styles.active : ''} ${(expanded === 'closing') ? styles.goodbye : ''}`} ref={containerRef}>
      <button type="button" onClick={toggleExpanded}>
        <span>
          {expanded ? 'close' : 'emoji picker'}
        </span>
      </button>
      {expanded && <EmojiPickerNoSSRWrapper onEmojiClick={handleClick} disableAutoFocus />}
    </div>
  );
}

export default EmojiPicker;