import styles from "./nav.module.css";
import { useRouter } from "next/router";
import { faCog, faHome, faList, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleFetch } from "../../pages/api";

export const Nav = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await handleFetch('/api/auth/logout');
    router.push('/');
  }
  const isActive = (path) => {
    if (router.pathname === path) return styles.active;
    return '';
  }
  return (
    <div className={styles.Nav}>
      <button className={isActive('/dashboard')} onClick={() => router.push('/dashboard')}>
        <FontAwesomeIcon icon={faHome} />
        <span>home</span>
      </button>
      <button className={isActive('/habits')} onClick={() => router.push('/habits')}>
        <FontAwesomeIcon icon={faList} />
        <span>my habits</span>
      </button>
      <button className={isActive('/account')} onClick={() => router.push('/account')}>
        <FontAwesomeIcon icon={faUser} />
        <span>my account</span>
      </button>
      <button className={isActive('/settings')} onClick={() => router.push('/settings')}>
        <FontAwesomeIcon icon={faCog} />
        <span>settings</span>
      </button>
      <button onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span>log out</span>
      </button>
    </div>
  );
}