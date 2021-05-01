import styles from "./submit.module.css";
import { fancyClassName } from "../../../utils";
import Button from "../Button";
import Loading from "../../Loading";

const Submit = ({ value, onClick, cancel, onCancel, successPending, successAnimation, className, disabled }) => {
  const hideText = !!successPending || !!successAnimation;
  return (
    <div className={`${styles.Submit} ${fancyClassName({ styles, className })}`}>
      <Button type="submit" onClick={onClick} disabled={disabled}>
        <span data-ghost={hideText}>{value ?? 'submit'}</span>
        <StatusIcon {...{ successPending, successAnimation }} />
      </Button>
      {(cancel !== false) && <Button className="cancel" onClick={onCancel}>{cancel ?? 'cancel'}</Button>}
    </div>
  );
}

const StatusIcon = ({ successPending, successAnimation }) => {
  if (!successPending && !successAnimation) return null;
  if (successPending) return <Loading />;
  if (successAnimation) return <SuccessAnimation status={successAnimation} />;
}

const SuccessAnimation = ({ status }) => {
  return (
    <div className={`SuccessAnimation ${status}`}>
      <svg viewBox="0 0 10 10">
        <path d="M5 10 L10 10 L10 0" />
      </svg>
    </div>
  );
}

export default Submit;