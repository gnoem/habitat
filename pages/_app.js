import "../styles/global.css";
import Router from "next/router";
import nprogress from "nprogress";
import { AppContextProvider } from "../contexts";
import { Layout } from "../components/Layout";

Router.events.on('routeChangeStart', () => nprogress.start());
Router.events.on('routeChangeComplete', () => nprogress.done());
Router.events.on('routeChangeError', () => nprogress.done());

const App = ({ Component, pageProps }) => {
  return (
    <AppContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContextProvider>
  );
}

export default App;