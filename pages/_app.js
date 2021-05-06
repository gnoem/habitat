import { useContext } from "react";
import Router, { useRouter } from "next/router";

import nprogress from "nprogress";

import "../styles/global.css";
import { AppContextProvider, ModalContext } from "../contexts";
import AppLayout from "../components/Layout";
import Modal from "../components/Modal";
import DashboardLayout from "../components/DashboardLayout";
import HomepageLayout from "../components/HomepageLayout";

Router.events.on('routeChangeStart', () => nprogress.start());
Router.events.on('routeChangeComplete', () => nprogress.done());
Router.events.on('routeChangeError', () => nprogress.done());

const App = ({ Component, pageProps }) => {
  return (
    <AppContextProvider>
      <AppLayout>
        <AppContent {...{ Component, pageProps }} />
      </AppLayout>
    </AppContextProvider>
  );
}

const AppContent = ({ Component, pageProps }) => {
  const { modal } = useContext(ModalContext);
  const router = useRouter();
  const protectedRoutes = ['/dashboard', '/habits', '/account', '/settings'];
  const PageLayout = (protectedRoutes.includes(router.pathname))
    ? DashboardLayout
    : HomepageLayout;
  return (
    <PageLayout>
      <Modal {...modal} />
      <Component {...pageProps} />
    </PageLayout>
  );
}

export default App;