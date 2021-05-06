import { fancyClassName } from "../../utils";
import styles from "./loading.module.css";

const Loading = ({ className }) => {
  return (
    <div className={`${styles.Loading} ${className ?? ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" r="44" strokeWidth="7" stroke="#fe718d" strokeDasharray="69.11503837897544 69.11503837897544" fill="none" strokeLinecap="square">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
        </circle>
      </svg>
    </div>
  );
}

export const PageLoading = ({ className }) => {
  return (
    <div className={`${styles.PageLoading} ${fancyClassName({ styles, className })}`}>
      <Loading />
    </div>
  );
}

export default Loading;