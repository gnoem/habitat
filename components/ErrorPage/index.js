import { useRouter } from "next/router";

import styles from "./errorPage.module.css";
import { Button } from "../Form";

const ErrorPage = ({ status, message }) => {
  const router = useRouter();
  return (
    <>
      <div className={styles.ErrorPage}>
        <h2>{status}</h2>
        <p>{message}</p>
      </div>
      <Button className="mt10 compact" onClick={() => router.push('/')}>
          &raquo; return to home
      </Button>
    </>
  );
}

export default ErrorPage;