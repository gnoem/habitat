import styles from "./layout.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { Header } from "../Header";
import { useEffect, useRef } from "react";
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

export const Layout = ({ children }) => {
  const { pathname } = useRouter();
  const homepage = ['/', '/login', '/register'].includes(pathname);
  return (
    <div className={styles.Layout}>
      <Header />
      <Backdrop {...{ pathname }} />
      {homepage && <img alt="" src="/decor/hmmm.png" />}
      {children}
    </div>
  );
}

const Backdrop = ({ pathname }) => {
  const hue = useRef(0);
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      //hue.current = Math.random() * (135 + 90) - 90;
      let [min, max] = [40, -40]
      hue.current = Math.random() * (max - min) + min;
    } else {
      didMountRef.current = true;
    }
  }, [pathname]);
  const startingColors = ['#D8FFF1', '#EADFFF', '#FCFFDF', '#E9FFC7', '#D4FFF7', '#FFE0F5']; // ['#e7c7ff', '#c7dfff', '#c7ffe3', '#e9ffc7']; // originally
  const blobs = startingColors.map(color => {
    const translation = {
      x: Math.random() * (50 + 50) - 50,
      y: Math.random() * (50 + 50) - 50
    }
    const size = {
      x: (Math.random() * (130 - 80) + 80) / 100,
      y: (Math.random() * (130 - 80) + 80) / 100
    }
    return (
      <Blob key={color} initial={color} hue={hue.current} translation={translation} size={size} />
    )
  });
  return (
    <div className={styles.base} style={{
      filter: `hue-rotate(${hue.current}deg)`,
    }}>{blobs}</div>
  );
}

const Blob = ({ initial, hue, translation, size }) => {
  return (
    <div className={styles.f} style={{
      background: `radial-gradient(${initial} 0%, transparent 70%)`,
      filter: `hue-rotate(${hue}deg)`,
      transform: `scale(${size.x}, ${size.y}) translate3d(${translation.x}%, ${translation.y}%, 0)`
    }}></div>
  );
}
