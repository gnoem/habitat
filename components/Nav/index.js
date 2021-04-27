import styles from "./nav.module.css";
import { useRouter } from "next/router";
import { faCog, faHome, faList, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleRequest } from "../../pages/api";
import { Sidebar } from "../Sidebar";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MobileContext } from "../../contexts";

export const Nav = () => {
  const router = useRouter();
  const isMobile = useContext(MobileContext);
  const [showingNav, setShowingNav] = useState(false);
  const navButtonRef = useRef(null);
  const navButtonsRef = useRef(null);
  const toggleNav = () => setShowingNav(state => !state);
  useEffect(() => {
    if (!showingNav) return;
    const closeNav = (e) => {
      if (!navButtonRef.current || !navButtonsRef.current) return;
      if (navButtonRef.current.contains(e.target)) return;
      if (navButtonsRef.current.contains(e.target)) return;
      setShowingNav(false);
    }
    window.addEventListener('click', closeNav);
    return () => window.removeEventListener('click', closeNav);
  }, [showingNav, navButtonRef.current, navButtonsRef.current]);
  return (
    <Sidebar>
      {isMobile && (
        <button
          className={`${styles.MobileNavButton} ${showingNav ? styles.expanded : ''}`}
          onClick={showingNav ? null : toggleNav}>
            <span ref={navButtonRef} onClick={showingNav ? toggleNav : null}></span>
        </button>
      )}
      {(!isMobile || showingNav) && <NavButtons ref={navButtonsRef} {...{ router, updateShowingNav: setShowingNav }} />}
    </Sidebar>
  );
}

const NavButtons = React.forwardRef(({ router, updateShowingNav }, ref) => {
  const handleClick = (e) => {
    updateShowingNav(false);
    const path = `/${e.currentTarget.name}`;
    router.push(path);
  }
  const isActive = (path) => {
    if (router.pathname === path) return styles.active;
    return '';
  }
  const handleLogout = async () => {
    await handleRequest('/api/auth/logout');
    router.push('/');
  }
  return (
    <div className={styles.Nav} ref={ref}>
      <button name="dashboard" className={isActive('/dashboard')} onClick={handleClick}>
        <FontAwesomeIcon icon={faHome} />
        <span>home</span>
      </button>
      <button name="habits" className={isActive('/habits')} onClick={handleClick}>
        <FontAwesomeIcon icon={faList} />
        <span>my habits</span>
      </button>
      <button name="account" className={isActive('/account')} onClick={handleClick}>
        <FontAwesomeIcon icon={faUser} />
        <span>my account</span>
      </button>
      <button name="settings" className={isActive('/settings')} onClick={handleClick}>
        <FontAwesomeIcon icon={faCog} />
        <span>settings</span>
      </button>
      <button onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span>log out</span>
      </button>
    </div>
  );
});