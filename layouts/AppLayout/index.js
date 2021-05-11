import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

import styles from "./appLayout.module.css";

const Layout = ({ children }) => {
  const { pathname } = useRouter();
  return (
    <div className={styles.AppLayout}>
      <Header />
      <Backdrop {...{ pathname }} />
      {/* does everytime context change mean the background backdrop shifts again? todo look into this more */}
      {children}
    </div>
  );
}

const Header = () => {
  return (
    <Head>
      <title>habitat</title>
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='100'>🍊</text></svg>" />
    </Head>
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
  const startingColors = [
    'rgb(216, 255, 241)',
    'rgb(234, 223, 255)',
    'rgb(252, 255, 223)',
    'rgb(233, 255, 199)',
    'rgb(212, 255, 247)',
    'rgb(255, 224, 245)'
  ];
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
  const transparentize = (rgb) => {
    // gradients that fade to transparent are interpreted/interpolated as ending in 'transparent black' in safari
    // this is a workaround
    return rgb.replace('rgb', 'rgba').split(')')[0] + ', 0)';
  }
  return (
    <div className={styles.f} style={{
      background: `radial-gradient(${initial} 0%, ${transparentize(initial)} 70%)`,
      filter: `hue-rotate(${hue}deg)`,
      transform: `scale(${size.x}, ${size.y}) translate3d(${translation.x}%, ${translation.y}%, 0)`
    }}></div>
  );
}

export default Layout;