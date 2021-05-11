import { useContext } from "react";
import Router, { useRouter } from "next/router";

import nprogress from "nprogress";

import "../styles/global.css";
import { AppContextProvider, ModalContext } from "../contexts";
import { AppLayout, DashboardWrapper, HomepageLayout } from "../layouts";
import Modal from "../components/Modal";

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
  const PageWrapper = (protectedRoutes.includes(router.pathname))
    ? DashboardWrapper
    : HomepageLayout;
  return (
    <PageWrapper>
      <Modal {...modal} />
      <Component {...pageProps} />
    </PageWrapper>
  );
}

export default App;